/**
 * API Core Module
 * Central API management and request handling
 */

import { CONFIG } from './config.js';

/**
 * Facebook Graph API base URL
 */
export const FB_GRAPH_API_BASE = `https://graph.facebook.com/${CONFIG.FB_API_VERSION}`;

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

  if (!accessToken) {
    throw new Error('Access token is required. Please pass it explicitly.');
  }

  const token = accessToken;

  // For POST/PUT/PATCH requests, send parameters in body; for GET, use query string
  let url;
  let fetchOptions = { method };

  const bodyMethods = ['POST', 'PUT', 'PATCH'];

  if (bodyMethods.includes(method)) {
    // Access token in query, other params in body
    const queryParams = new URLSearchParams({ access_token: token });
    url = `${FB_GRAPH_API_BASE}/${endpoint}?${queryParams}`;

    // Send other parameters in the request body
    const bodyParams = new URLSearchParams(params);
    fetchOptions.headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    fetchOptions.body = bodyParams;
  } else {
    // GET request - all params in query string
    // Place params first, then access_token to ensure token takes precedence
    const queryParams = new URLSearchParams({
      ...params,
      access_token: token
    });
    url = `${FB_GRAPH_API_BASE}/${endpoint}?${queryParams}`;
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorData = await response.json();
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
 * @param {string} friendlyName - API friendly name
 * @param {string} accessToken - Access token (optional)
 * @param {Object} extraParams - Optional additional parameters for the request body
 * @returns {Promise<Object>} API response
 */
export async function graphQLRequest(docId, variables, friendlyName, accessToken = null, extraParams = {}) {
  if (!accessToken) {
    throw new Error('Access token is required. Please pass it explicitly.');
  }

  const token = accessToken;

  const urlencoded = new URLSearchParams();
  urlencoded.append('access_token', token);

  // Add any extra parameters first (e.g., paymentAccountID)
  for (const [key, value] of Object.entries(extraParams)) {
    urlencoded.append(key, value);
  }

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
