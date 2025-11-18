/**
 * Fanpage Management Module
 * Handles operations related to Facebook pages
 */

import { postFormData } from '../utils/http.js';

/**
 * Appeal/request review for Facebook page
 * @param {string} pageId - Page ID
 * @param {string} accessToken - Facebook access token
 * @returns {Promise<Object>} Result of the appeal
 */
export async function appealFanpage(pageId, accessToken) {
  try {
    const urlencoded = new URLSearchParams();
    urlencoded.append('access_token', accessToken);

    const variables = {
      input: {
        page_id: pageId,
        appeal_reason: null,
        client_mutation_id: '1'
      }
    };

    urlencoded.append('fb_api_req_friendly_name', 'PageAppealMutation');
    urlencoded.append('variables', JSON.stringify(variables));
    urlencoded.append('doc_id', '6187985357937864'); // Example doc_id
    urlencoded.append('fb_api_caller_class', 'RelayModern');

    const response = await postFormData('https://www.facebook.com/api/graphql/', urlencoded);

    return {
      success: true,
      message: 'Page appeal submitted successfully',
      data: response
    };

  } catch (error) {
    console.error('Error appealing fanpage:', error);
    return {
      success: false,
      message: error.message,
      error
    };
  }
}

/**
 * Delete Facebook page
 * @param {string} pageId - Page ID to delete
 * @param {string} accessToken - Facebook access token
 * @returns {Promise<Object>} Result of deletion
 */
export async function deleteFanpage(pageId, accessToken) {
  try {
    const urlencoded = new URLSearchParams();
    urlencoded.append('access_token', accessToken);

    const variables = {
      input: {
        page_id: pageId,
        client_mutation_id: '1'
      }
    };

    urlencoded.append('fb_api_req_friendly_name', 'PageDeleteMutation');
    urlencoded.append('variables', JSON.stringify(variables));
    urlencoded.append('doc_id', '4787981637941331'); // Example doc_id
    urlencoded.append('fb_api_caller_class', 'RelayModern');

    const response = await postFormData('https://www.facebook.com/api/graphql/', urlencoded);

    return {
      success: true,
      message: 'Page deleted successfully',
      data: response
    };

  } catch (error) {
    console.error('Error deleting fanpage:', error);
    return {
      success: false,
      message: error.message,
      error
    };
  }
}

/**
 * Unhide Facebook page
 * @param {string} pageId - Page ID to unhide
 * @param {string} accessToken - Facebook access token
 * @returns {Promise<Object>} Result of unhide operation
 */
export async function unhideFanpage(pageId, accessToken) {
  try {
    const urlencoded = new URLSearchParams();
    urlencoded.append('access_token', accessToken);

    const variables = {
      input: {
        page_id: pageId,
        is_hidden: false,
        client_mutation_id: '1'
      }
    };

    urlencoded.append('fb_api_req_friendly_name', 'PageUnhideMutation');
    urlencoded.append('variables', JSON.stringify(variables));
    urlencoded.append('doc_id', '4787981637941332'); // Example doc_id
    urlencoded.append('fb_api_caller_class', 'RelayModern');

    const response = await postFormData('https://www.facebook.com/api/graphql/', urlencoded);

    return {
      success: true,
      message: 'Page unhidden successfully',
      data: response
    };

  } catch (error) {
    console.error('Error unhiding fanpage:', error);
    return {
      success: false,
      message: error.message,
      error
    };
  }
}

/**
 * Get page details
 * @param {string} pageId - Page ID
 * @param {string} accessToken - Facebook access token
 * @returns {Promise<Object>} Page details
 */
export async function getPageDetails(pageId, accessToken) {
  try {
    const fields = [
      'id',
      'name',
      'category',
      'verification_status',
      'fan_count',
      'is_published',
      'is_webhooks_subscribed'
    ];

    const url = `https://graph.facebook.com/v18.0/${pageId}?fields=${fields.join(',')}&access_token=${accessToken}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return {
      success: true,
      data
    };

  } catch (error) {
    console.error('Error getting page details:', error);
    return {
      success: false,
      message: error.message,
      error
    };
  }
}

export default {
  appealFanpage,
  deleteFanpage,
  unhideFanpage,
  getPageDetails
};
