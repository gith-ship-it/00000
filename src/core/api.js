/**
 * API Core Module
 * Central API management and request handling
 */

import { getAccessToken } from './auth.js';

/**
 * Facebook Graph API base URL
 */
export const FB_GRAPH_API_BASE = 'https://graph.facebook.com/v18.0';

/**
 * Facebook GraphQL API URL
 */
export const FB_GRAPHQL_API = 'https://www.facebook.com/api/graphql/';

/**
 * Make a Facebook Graph API request
 * @param {string} endpoint - API endpoint (e.g., 'me', 'act_123456/campaigns')
 * @param {Object} options - Request options
 * @returns {Promise<Object>} API response
 */
export async function graphAPIRequest(endpoint, options = {}) {
  const {
    method = 'GET',
    params = {},
    accessToken = null
  } = options;

  const token = accessToken || getAccessToken().token;

  if (!token) {
    throw new Error('Access token not available');
  }

  const queryParams = new URLSearchParams({
    access_token: token,
    ...params
  });

  const url = `${FB_GRAPH_API_BASE}/${endpoint}?${queryParams}`;

  const response = await fetch(url, { method });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'API request failed');
  }

  return await response.json();
}

/**
 * Make a Facebook GraphQL request
 * @param {string} docId - GraphQL document ID
 * @param {Object} variables - GraphQL variables
 * @param {string} friendlyName - API friendly name
 * @param {string} accessToken - Access token (optional)
 * @returns {Promise<Object>} API response
 */
export async function graphQLRequest(docId, variables, friendlyName, accessToken = null) {
  const token = accessToken || getAccessToken().token;

  if (!token) {
    throw new Error('Access token not available');
  }

  const urlencoded = new URLSearchParams();
  urlencoded.append('access_token', token);
  urlencoded.append('doc_id', docId);
  urlencoded.append('variables', JSON.stringify(variables));
  urlencoded.append('fb_api_req_friendly_name', friendlyName);
  urlencoded.append('fb_api_caller_class', 'RelayModern');

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
 * Batch multiple Graph API requests
 * @param {Array<Object>} requests - Array of request objects
 * @param {string} accessToken - Access token (optional)
 * @returns {Promise<Array>} Array of responses
 */
export async function batchGraphAPIRequests(requests, accessToken = null) {
  const token = accessToken || getAccessToken().token;

  if (!token) {
    throw new Error('Access token not available');
  }

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
 * Handle API errors
 * @param {Error} error - Error object
 * @returns {Object} Formatted error response
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
