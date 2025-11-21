/**
 * API Core Module
 * Central API management and request handling
 */

import { CONFIG } from './config.js';

/**
 * Facebook Graph API base URL
 * @constant {string}
 */
export const FB_GRAPH_API_BASE = `https://graph.facebook.com/${CONFIG.FB_API_VERSION}`;

/**
 * Facebook GraphQL API URL
 * @constant {string}
 */
export const FB_GRAPHQL_API = 'https://www.facebook.com/api/graphql/';

/**
 * Make a Facebook Graph API request
 * @param {string} endpoint - API endpoint (e.g., 'me', 'act_123456/campaigns')
 * @param {Object} [options={}] - Request options
 * @param {string} [options.method='GET'] - HTTP method
 * @param {Object} [options.params={}] - Query parameters
 * @param {string} [options.accessToken=null] - Facebook access token (required)
 * @returns {Promise<Object>} API response JSON
 * @throws {Error} If access token is missing or API request fails
 */
export async function graphAPIRequest(endpoint, options = {}) {
  const { method = 'GET', params = {}, accessToken = null } = options;

  if (!accessToken) {
    throw new Error('Access token is required. Please pass it explicitly.');
  }

  const token = accessToken;

  const queryParams = new URLSearchParams({
    ...params,
    access_token: token
  });

  const url = `${FB_GRAPH_API_BASE}/${endpoint}?${queryParams}`;

  const response = await fetch(url, { method });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (jsonError) {
      console.error('Failed to parse API error response as JSON:', jsonError);
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }
    // Log full error details for debugging
    console.error('Facebook API Error Details:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData.error,
      endpoint: endpoint
    });
    // Throw error with detailed message
    const errorMessage = errorData.error?.message || 'API request failed';
    const errorCode = errorData.error?.code || 'UNKNOWN';
    const errorType = errorData.error?.type || 'Unknown';
    throw new Error(`${errorMessage} (Code: ${errorCode}, Type: ${errorType})`);
  }

  return await response.json();
}

/**
 * Make a Facebook GraphQL request
 * @param {string} docId - GraphQL document ID
 * @param {Object} variables - GraphQL variables
 * @param {string} friendlyName - API friendly name for identifying the request
 * @param {string} [accessToken=null] - Facebook access token (required)
 * @param {Object} [extraParams={}] - Optional additional parameters for the request body (e.g. paymentAccountID)
 * @returns {Promise<Object>} API response JSON
 * @throws {Error} If access token is missing, HTTP error occurs, or GraphQL returns errors
 */
export async function graphQLRequest(
  docId,
  variables,
  friendlyName,
  accessToken = null,
  extraParams = {}
) {
  if (!accessToken) {
    throw new Error('Access token is required. Please pass it explicitly.');
  }

  const token = accessToken;
  const { dtsg, userId } = context;

  const urlencoded = new URLSearchParams();
  // Note: decompressed_fbacc.js includes access_token in some cases, but relies heavily on dtsg/av
  urlencoded.append('access_token', token);

  if (dtsg) {
    urlencoded.append('fb_dtsg', dtsg);
  }

  if (userId) {
    urlencoded.append('av', userId);
    urlencoded.append('__user', userId);
  }

  // Add standard params matching decompressed_fbacc.js
  urlencoded.append('fb_api_caller_class', 'RelayModern');
  urlencoded.append('fb_api_req_friendly_name', friendlyName);
  urlencoded.append('doc_id', docId);
  urlencoded.append('variables', JSON.stringify(variables));
  urlencoded.append('server_timestamps', 'true');

  const response = await fetch(FB_GRAPHQL_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: urlencoded
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors[0].message);
  }

  return result;
}

/**
 * Batch multiple Graph API requests into a single HTTP call
 * @param {Array<Object>} requests - Array of request objects. Each object should have 'method', 'endpoint', and 'params'.
 * @param {string} [requests[].method='GET'] - HTTP method for the individual request
 * @param {string} requests[].endpoint - Relative API endpoint for the individual request
 * @param {Object} [requests[].params] - Query parameters for the individual request
 * @param {string} [accessToken=null] - Facebook access token (required)
 * @returns {Promise<Array<Object>>} Array of response objects, each containing { success: boolean, data|error: Object }
 * @throws {Error} If access token is missing or batch request itself fails
 */
export async function batchGraphAPIRequests(requests, accessToken = null) {
  if (!accessToken) {
    throw new Error('Access token is required. Please pass it explicitly.');
  }

  const token = accessToken;

  const batch = requests.map(req => ({
    method: req.method || 'GET',
    relative_url: req.endpoint + (req.params ? `?${new URLSearchParams(req.params)}` : '')
  }));

  const params = new URLSearchParams({
    access_token: token,
    batch: JSON.stringify(batch)
  });

  const url = `${FB_GRAPH_API_BASE}?${params}`;

  const response = await fetch(url, { method: 'POST' });

  if (!response.ok) {
    throw new Error('Batch request failed');
  }

  const results = await response.json();

  return results.map(result => {
    if (result.code !== 200) {
      return {
        success: false,
        error: JSON.parse(result.body)
      };
    }
    return {
      success: true,
      data: JSON.parse(result.body)
    };
  });
}

/**
 * Handle API errors and normalize them into a standard format
 * @param {Error} error - The error object caught from a try/catch block
 * @returns {Object} Formatted error response
 * @property {boolean} success - Always false
 * @property {Object} error - Error details
 * @property {string} error.code - Standardized error code (e.g., 'INVALID_TOKEN', 'PERMISSION_DENIED', 'RATE_LIMIT', 'UNKNOWN_ERROR')
 * @property {string} error.message - Human-readable error message
 */
export function handleAPIError(error) {
  console.error('API Error:', error);

  let message = error.message || 'Unknown error occurred';
  let code = 'UNKNOWN_ERROR';

  // Parse Facebook API errors
  if (error.message) {
    if (error.message.includes('access token')) {
      code = 'INVALID_TOKEN';
      message = 'Invalid or expired access token';
    } else if (error.message.includes('permission')) {
      code = 'PERMISSION_DENIED';
      message = 'Permission denied';
    } else if (error.message.includes('rate limit')) {
      code = 'RATE_LIMIT';
      message = 'Rate limit exceeded';
    }
  }

  return {
    success: false,
    error: {
      code,
      message
    }
  };
}

export default {
  FB_GRAPH_API_BASE,
  FB_GRAPHQL_API,
  graphAPIRequest,
  graphQLRequest,
  batchGraphAPIRequests,
  handleAPIError
};
