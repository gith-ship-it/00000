/**
 * Authentication and Token Management
 * Handles Facebook access token extraction and authentication
 */

import { getCookie, getURLParameter } from '../utils/helpers.js';
import { CONFIG } from './config.js';

/**
 * Check if user is authenticated as page or personal profile
 * @returns {boolean} True if page auth, false if personal profile
 */
export function checkAuth() {
  if (getCookie(CONFIG.COOKIES.USER_ID) !== undefined) {
    return true; // Page authentication
  }
  return false; // Personal profile
}

/**
 * Get Facebook access token from page scripts
 * @returns {Object} Token information { token, accountId, isPageAuth, dtsg, userId }
 */
export function getAccessToken() {
  const isPageAuth = checkAuth();
  console.log('Is page auth?', isPageAuth);
  console.log('Looking for access token...');

  const scripts = document.getElementsByTagName('script');
  let token = '';
  let accountId = '';
  let dtsg = '';
  let userId = '';

  // Get selected account from URL parameter
  const selectedAccount = getURLParameter('act');
  const elementIdRegEx = /selected_account_id:"(.*?)"/i;

  // Expanded regex to handle non-alphanumeric characters in token (e.g. _, -, .)
  // Matches "EA..." followed by at least 20 valid token characters
  const tokenRegex = /"EA[A-Za-z0-9._-]{20,}[^"]*/;

  for (let i = 0; i < scripts.length; i++) {
    const html = scripts[i].innerHTML;

    // Extract access token - Allow overwriting to find the last/best token
    const tokenMatch = html.match(tokenRegex);
    if (tokenMatch && tokenMatch[0]) {
      // Remove the leading quote
      let candidate = tokenMatch[0].substring(1);
      // Clean trailing quote if captured (regex shouldn't capture it due to exclusion, but safety first)
      if (candidate.endsWith('"')) candidate = candidate.slice(0, -1);

      token = candidate;
      // console.log('Access token found (updating)');
    }

    // Extract account ID - Allow overwriting
    if (!selectedAccount) {
      const accountIdMatch = elementIdRegEx.exec(html);
      if (accountIdMatch && accountIdMatch[1]) {
        accountId = accountIdMatch[1];
        // console.log('Account ID found (updating):', accountId);
      }
    }

    // Attempt to extract DTSG token from script content
    // Look for DTSGInitialData pattern with optional spacing
    const dtsgMatch = html.match(/"token"\s*:\s*"([^"]+)"/);
    if (dtsgMatch && html.includes('DTSGInitialData')) {
        dtsg = dtsgMatch[1];
        // console.log('DTSG token found in script (updating)');
    }

    // Attempt to extract User ID
    // Match "USER_ID":"123" with optional spacing
    const userIdMatch = html.match(/"USER_ID"\s*:\s*"([0-9]+)"/);
    if (userIdMatch && html.includes('CurrentUserInitialData')) {
        userId = userIdMatch[1];
        // console.log('User ID found in script (updating)');
    }
  }

  if (token) console.log('Final Access Token found');
  if (accountId) console.log('Final Account ID found:', accountId);
  if (dtsg) console.log('Final DTSG token found');
  if (userId) console.log('Final User ID found');

  // Fallback for DTSG: Check hidden input
  if (!dtsg) {
    const dtsgElement = document.querySelector('[name="fb_dtsg"]');
    if (dtsgElement) {
      dtsg = dtsgElement.value;
      console.log('DTSG token found in DOM (fallback)');
    }
  }

  // Fallback for User ID: Check cookie
  if (!userId) {
      const cUser = getCookie('c_user');
      if (cUser) {
          userId = cUser;
          console.log('User ID found in cookie (fallback)');
      }
  }

  // Use selected account from URL if available
  if (selectedAccount) {
    accountId = selectedAccount.replace('act=', '');
  }

  return {
    token,
    accountId,
    isPageAuth,
    dtsg,
    userId
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
  const tokenPattern = /^EA[A-Za-z0-9._-]{20,}$/;
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
