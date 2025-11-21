/**
 * Authentication and Token Management
 * Handles Facebook access token extraction and authentication
 */

import { getCookie, getURLParameter } from '../utils/helpers.js';
import { CONFIG } from './config.js';

/**
 * Check if user is authenticated as page or personal profile.
 * It checks for the presence of the 'i_user' cookie.
 * @returns {boolean} True if page auth (cookie exists), false if personal profile
 */
export function checkAuth() {
  if (getCookie(CONFIG.COOKIES.USER_ID) !== undefined) {
    return true; // Page authentication
  }
  return false; // Personal profile
}

/**
 * Get Facebook access token and account ID from page scripts.
 * It scans script tags for token patterns and account ID patterns.
 * @returns {Object} Token information object
 * @property {string} token - The extracted access token (empty string if not found)
 * @property {string} accountId - The extracted ad account ID (empty string if not found)
 * @property {boolean} isPageAuth - Whether the user is authenticated as a page
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

  // Robust regex from original fbacc.js
  const tokenRegex = /"EA[A-Za-z0-9]{20,}/;

  for (let i = 0; i < scripts.length; i++) {
    const html = scripts[i].innerHTML;

    // Extract access token
    if (!token) {
      const tokenMatch = html.match(tokenRegex);
      if (tokenMatch && tokenMatch[0]) {
        // Remove the leading quote
        token = tokenMatch[0].substring(1);
        console.log('Access token found');
      }
    }

    // Extract account ID
    if (!selectedAccount && !accountId) {
      const accountIdMatch = elementIdRegEx.exec(html);
      if (accountIdMatch && accountIdMatch[1]) {
        accountId = accountIdMatch[1];
        console.log('Account ID found:', accountId);
      }
    }

    // Attempt to extract DTSG token from script content (simulating require("DTSGInitialData").token)
    if (!dtsg) {
      // Look for DTSGInitialData pattern with optional spacing
      const dtsgMatch = html.match(/"token"\s*:\s*"([^"]+)"/);
      if (dtsgMatch && html.includes('DTSGInitialData')) {
         dtsg = dtsgMatch[1];
         console.log('DTSG token found in script');
      }
    }

    // Attempt to extract User ID (simulating require("CurrentUserInitialData").USER_ID)
    if (!userId) {
       // Match "USER_ID":"123" with optional spacing
       const userIdMatch = html.match(/"USER_ID"\s*:\s*"([0-9]+)"/);
       if (userIdMatch && html.includes('CurrentUserInitialData')) {
           userId = userIdMatch[1];
           console.log('User ID found in script');
       }
    }
  }

  // Fallback for DTSG: Check hidden input
  if (!dtsg) {
    const dtsgElement = document.querySelector('[name="fb_dtsg"]');
    if (dtsgElement) {
      dtsg = dtsgElement.value;
      console.log('DTSG token found in DOM');
    }
  }

  // Fallback for User ID: Check cookie
  if (!userId) {
      const cUser = getCookie('c_user');
      if (cUser) {
          userId = cUser;
          console.log('User ID found in cookie');
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
 * Validate access token format.
 * Checks if the token starts with 'EA' and is at least 20 characters long.
 * @param {string} token - Access token to validate
 * @returns {boolean} True if token is valid format, false otherwise
 */
export function validateToken(token) {
  if (!token) return false;

  // Facebook tokens typically start with EA and are at least 20 characters
  const tokenPattern = /^EA[A-Za-z0-9]{20,}$/;
  return tokenPattern.test(token);
}

/**
 * Prompt user to switch to personal profile if they are authenticated as a page.
 * Opens a forced account switch window if the user confirms.
 * @param {Function} [callback] - Callback to execute if no switch is needed or after check
 * @returns {boolean} True if no switch was needed (already personal profile), False if switch prompt was shown
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
