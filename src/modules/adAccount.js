/**
 * Ad Account Management Module
 * Handles operations related to Facebook ad accounts
 */

import { postFormData } from '../utils/http.js';

import { CONFIG } from '../core/config.js';
/**
 * Appeal/request review for ad account
 * @param {string} accountId - Ad account ID
 * @param {string} accessToken - Facebook access token
 * @returns {Promise<Object>} Result of the appeal
 */
export async function appealAdAccount(accountId, accessToken) {
  try {
    const urlencoded = new URLSearchParams();
    urlencoded.append('access_token', accessToken);

    const variables = {
      input: {
        client_mutation_id: '1',
        actor_id: accountId,
        ad_account_id: accountId,
        ids_issue_ent_id: '1',
        appeal_comment: "I'm not sure which policy was violated.",
        callsite: 'ACCOUNT_QUALITY'
      }
    };

    urlencoded.append('fb_api_req_friendly_name', 'useAdAccountALRAppealMutation');
    urlencoded.append('variables', JSON.stringify(variables));
    urlencoded.append('doc_id', CONFIG.GRAPHQL_DOC_IDS.AD_ACCOUNT_APPEAL);
    urlencoded.append('fb_api_caller_class', 'RelayModern');

    const response = await postFormData('https://www.facebook.com/api/graphql/', urlencoded);

    return {
      success: true,
      message: 'Ad account appeal submitted successfully',
      data: response
    };

  } catch (error) {
    console.error('Error appealing ad account:', error);
    return {
      success: false,
      message: error.message,
      error
    };
  }
}

/**
 * Delete ad account
 * @param {string} adAccountId - Ad account ID to delete
 * @param {string} accessToken - Facebook access token
 * @returns {Promise<Object>} Result of deletion
 */
export async function deleteAdAccount(adAccountId, accessToken) {
  try {
    const urlencoded = new URLSearchParams();
    urlencoded.append('access_token', accessToken);

    const variables = {
      input: {
        ad_account_id: adAccountId,
        actor_id: adAccountId,
        client_mutation_id: '1'
      }
    };

    urlencoded.append('fb_api_req_friendly_name', 'AdAccountDeleteMutation');
    urlencoded.append('variables', JSON.stringify(variables));
    urlencoded.append('doc_id', CONFIG.GRAPHQL_DOC_IDS.AD_ACCOUNT_DELETE);

    const response = await postFormData('https://www.facebook.com/api/graphql/', urlencoded);

    return {
      success: true,
      message: 'Ad account deleted successfully',
      data: response
    };

  } catch (error) {
    console.error('Error deleting ad account:', error);
    return {
      success: false,
      message: error.message,
      error
    };
  }
}

/**
 * Remove ad account from user
 * @param {string} adAccountId - Ad account ID
 * @param {string} userId - User ID to remove
 * @param {string} accessToken - Facebook access token
 * @returns {Promise<Object>} Result of removal
 */
export async function removeAdAccountAccess(adAccountId, userId, accessToken) {
  try {
    const urlencoded = new URLSearchParams();
    urlencoded.append('access_token', accessToken);

    const variables = {
      input: {
        account_id: adAccountId,
        user_id: userId,
        client_mutation_id: '1'
      }
    };

    urlencoded.append('fb_api_req_friendly_name', 'RemoveAdAccountAccessMutation');
    urlencoded.append('variables', JSON.stringify(variables));
    // TODO: Replace with actual doc_id from Facebook GraphQL API
    urlencoded.append('doc_id', '5123456789012345');

    const response = await postFormData('https://www.facebook.com/api/graphql/', urlencoded);

    return {
      success: true,
      message: 'Ad account access removed successfully',
      data: response
    };

  } catch (error) {
    console.error('Error removing ad account access:', error);
    return {
      success: false,
      message: error.message,
      error
    };
  }
}

/**
 * Get ad account details
 * @param {string} accountId - Ad account ID
 * @param {string} accessToken - Facebook access token
 * @returns {Promise<Object>} Account details
 */
export async function getAdAccountDetails(accountId, accessToken) {
  try {
    const fields = [
      'id',
      'name',
      'account_status',
      'disable_reason',
      'currency',
      'timezone_name',
      'amount_spent',
      'balance',
      'funding_source_details'
    ];

    const url = `https://graph.facebook.com/${CONFIG.FB_API_VERSION}/act_${accountId}?fields=${fields.join(',')}&access_token=${accessToken}`;

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
    console.error('Error getting ad account details:', error);
    return {
      success: false,
      message: error.message,
      error
    };
  }
}

export default {
  appealAdAccount,
  deleteAdAccount,
  removeAdAccountAccess,
  getAdAccountDetails
};
