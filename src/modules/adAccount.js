/**
 * Ad Account Management Module
 * Handles operations related to Facebook ad accounts
 */

import { graphAPIRequest, graphQLRequest } from '../core/api.js';
import { CONFIG } from '../core/config.js';
/**
 * Appeal/request review for ad account
 * @param {string} accountId - Ad account ID
 * @param {string} accessToken - Facebook access token
 * @returns {Promise<Object>} Result of the appeal
 */
export async function appealAdAccount(accountId, accessToken) {
  try {
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

    const response = await graphQLRequest(
      CONFIG.GRAPHQL_DOC_IDS.AD_ACCOUNT_APPEAL,
      variables,
      'useAdAccountALRAppealMutation',
      accessToken
    );

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
    const variables = {
      input: {
        ad_account_id: adAccountId,
        actor_id: adAccountId,
        client_mutation_id: '1'
      }
    };

    const response = await graphQLRequest(
      CONFIG.GRAPHQL_DOC_IDS.AD_ACCOUNT_DELETE,
      variables,
      'AdAccountDeleteMutation',
      accessToken
    );

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
    const variables = {
      input: {
        account_id: adAccountId,
        user_id: userId,
        client_mutation_id: '1'
      }
    };

    const response = await graphQLRequest(
      CONFIG.GRAPHQL_DOC_IDS.AD_ACCOUNT_REMOVE_ACCESS,
      variables,
      'RemoveAdAccountAccessMutation',
      accessToken
    );

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
    // Basic fields that should be available to most access tokens
    const basicFields = [
      'id',
      'name',
      'account_status',
      'disable_reason',
      'currency',
      'timezone_name'
    ];

    // Try to get basic account details first
    let data = await graphAPIRequest(`act_${accountId}`, {
      params: {
        fields: basicFields.join(',')
      },
      accessToken
    });

    // Try to get additional fields if permissions allow
    // These fields require ads_management or business_management permissions
    const sensitiveFields = [
      'amount_spent',
      'balance',
      'funding_source_details'
    ];

    try {
      const additionalData = await graphAPIRequest(`act_${accountId}`, {
        params: {
          fields: sensitiveFields.join(',')
        },
        accessToken
      });

      // Merge additional fields if successful
      data = { ...data, ...additionalData };
    } catch (permissionError) {
      // Log warning but don't fail - these fields are optional
      console.warn('Could not fetch sensitive account fields (this is normal if token lacks permissions):', permissionError.message);
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
