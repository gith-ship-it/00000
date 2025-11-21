/**
 * Fanpage Management Module
 * Handles operations related to Facebook pages
 */

import { graphAPIRequest, graphQLRequest } from '../core/api.js';
import { CONFIG } from '../core/config.js';
/**
 * Appeal/request review for Facebook page
 * @param {string} pageId - Page ID
 * @param {string} accessToken - Facebook access token
 * @returns {Promise<Object>} Result of the appeal
 */
export async function appealFanpage(pageId, accessToken) {
  try {
    const variables = {
      input: {
        page_id: pageId,
        appeal_reason: null,
        client_mutation_id: '1'
      }
    };

    const response = await graphQLRequest(
      CONFIG.GRAPHQL_DOC_IDS.PAGE_APPEAL,
      variables,
      'useAdAccountALRAppealMutation',
      accessToken
    );

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
    const variables = {
      input: {
        page_id: pageId,
        client_mutation_id: '1'
      }
    };

    const response = await graphQLRequest(
      CONFIG.GRAPHQL_DOC_IDS.PAGE_DELETE,
      variables,
      'usePagesCometDeletePageMutation',
      accessToken
    );

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
    const variables = {
      input: {
        page_id: pageId,
        is_hidden: false,
        client_mutation_id: '1'
      }
    };

    const response = await graphQLRequest(
      CONFIG.GRAPHQL_DOC_IDS.PAGE_UNHIDE,
      variables,
      'usePagesCometEditPageVisibilityMutation',
      accessToken
    );

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

    const data = await graphAPIRequest(pageId, {
      params: {
        fields: fields.join(',')
      },
      accessToken
    });

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
