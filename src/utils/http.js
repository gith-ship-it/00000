/**
 * HTTP Request Utilities
 * Wrapper functions for making HTTP requests
 */

/**
 * Make a GET request and parse JSON response using fetch API
 * @param {string} url - URL to fetch
 * @param {string} type - Request type (default: 'GET')
 * @returns {Promise<any>} Parsed JSON response
 */
export async function getJSON(url, type = 'GET') {
  const response = await fetch(url, { method: type });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

/**
 * Make a POST request with form data
 * @param {string} url - URL to post to
 * @param {URLSearchParams} data - Form data to send
 * @param {Object} headers - Additional headers
 * @returns {Promise<any>} Response data
 */
export async function postFormData(url, data, headers = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { ...defaultHeaders, ...headers },
    body: data
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

/**
 * Make a GraphQL request to Facebook API
 * @param {string} query - GraphQL query
 * @param {Object} variables - Query variables
 * @param {string} accessToken - Facebook access token
 * @returns {Promise<any>} Response data
 */
export async function graphQLRequest(query, variables, accessToken) {
  const urlencoded = new URLSearchParams();
  urlencoded.append('access_token', accessToken);
  urlencoded.append('doc_id', query);
  urlencoded.append('variables', JSON.stringify(variables));
  urlencoded.append('fb_api_req_friendly_name', 'GraphQLRequest');
  urlencoded.append('fb_api_caller_class', 'RelayModern');

  return await postFormData('https://www.facebook.com/api/graphql/', urlencoded);
}

export default {
  getJSON,
  postFormData,
  graphQLRequest
};
