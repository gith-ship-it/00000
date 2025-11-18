/**
 * Authentication and Token Management
 * Handles Facebook access token extraction and authentication
 */

import { getCookie, getURLParameter } from '../utils/helpers.js';

/**
 * Check if user is authenticated as page or personal profile
 * @returns {boolean} True if page auth, false if personal profile
 */
export function checkAuth() {
  if (getCookie('i_user') !== undefined) {
    return true; // Page authentication
  }
  return false; // Personal profile
}

/**
 * Get Facebook access token from page scripts
 * @returns {Object} Token information { token, accountId, isPageAuth }
 */
export function getAccessToken() {
  const isPageAuth = checkAuth();
  console.log('Is page auth?', isPageAuth);
  console.log('Looking for access token...');

  const scripts = document.getElementsByTagName('script');
  let token = '';
  let accountId = '';

  // Get selected account from URL parameter
  const selectedAccount = getURLParameter('act');
  const elementIdRegEx = /selected_account_id:"(.*?)"/gi;
  const tokenRegex = /"EA[A-Za-z0-9]{20,}/gm;

  for (let i = 0; i < scripts.length; i++) {
    const html = scripts[i].innerHTML;

    // Extract access token
    if (!token && html.search(tokenRegex) > -1) {
      const match = html.match(tokenRegex);
      if (match && match[0]) {
        token = match[0].substr(1); // Remove leading quote
        console.log('Access token found');
      }
    }

    // Extract account ID
    if (!selectedAccount && !accountId && html.search(elementIdRegEx) > -1) {
      const match = html.match(elementIdRegEx);
      if (match && match[0]) {
        accountId = match[0].split('"')[1];
        console.log('Account ID found:', accountId);
      }
    }
  }

  // Use selected account from URL if available
  if (selectedAccount) {
    accountId = selectedAccount.replace('act=', '');
  }

  return {
    token,
    accountId,
    isPageAuth
  };
}

/**
 * Validate access token
 * @param {string} token - Access token to validate
 * @returns {boolean} True if token is valid format
 */
export function validateToken(token) {
  if (!token) return false;

  // Facebook tokens typically start with EA and are at least 20 characters
  const tokenPattern = /^EA[A-Za-z0-9]{20,}$/;
  return tokenPattern.test(token);
}

/**
 * Prompt user to switch to personal profile if needed
 * @param {Function} callback - Callback to execute after switch
 */
export function promptAccountSwitch(callback) {
  const isPageAuth = checkAuth();

  if (isPageAuth) {
    const message = 'You need to switch to personal profile to continue!';
    const switchUrl = 'https://www.facebook.com/forced_account_switch';

    const shouldSwitch = confirm(`${message}\n\nClick OK to open account switcher.`);

    if (shouldSwitch) {
      window.open(switchUrl, 'popUpWindow', 'height=500,width=900');
    }

    return false;
  }

  if (callback) callback();
  return true;
}

export default {
  checkAuth,
  getAccessToken,
  validateToken,
  promptAccountSwitch
};
