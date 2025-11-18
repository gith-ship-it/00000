/**
 * Settings Management Module
 * Handles currency, timezone, and other account settings
 */

import { postFormData } from '../utils/http.js';
import { showPopup, hidePopup } from '../utils/dom.js';
import { CONFIG } from '../core/config.js';

/**
 * Update ad account currency
 * @param {string} accountId - Ad account ID
 * @param {string} currency - Currency code (e.g., 'USD')
 * @param {string} accessToken - Facebook access token
 * @returns {Promise<Object>} Result of update
 */
export async function updateAccountCurrency(accountId, currency, accessToken) {
  try {
    const urlencoded = new URLSearchParams();
    urlencoded.append('access_token', accessToken);

    const variables = {
      input: {
        account_id: accountId,
        currency: currency.toUpperCase(),
        client_mutation_id: '1'
      }
    };

    urlencoded.append('fb_api_req_friendly_name', 'AdAccountCurrencyUpdateMutation');
    urlencoded.append('variables', JSON.stringify(variables));
    urlencoded.append('doc_id', '4787981637941337'); // Example doc_id
    urlencoded.append('fb_api_caller_class', 'RelayModern');

    const response = await postFormData('https://www.facebook.com/api/graphql/', urlencoded);

    return {
      success: true,
      message: `Currency updated to ${currency} successfully`,
      data: response
    };

  } catch (error) {
    console.error('Error updating currency:', error);
    return {
      success: false,
      message: error.message,
      error
    };
  }
}

/**
 * Update ad account timezone
 * @param {string} accountId - Ad account ID
 * @param {string} timezone - Timezone name (e.g., 'America/New_York')
 * @param {string} accessToken - Facebook access token
 * @returns {Promise<Object>} Result of update
 */
export async function updateAccountTimezone(accountId, timezone, accessToken) {
  try {
    const urlencoded = new URLSearchParams();
    urlencoded.append('access_token', accessToken);

    const variables = {
      input: {
        account_id: accountId,
        timezone_name: timezone,
        client_mutation_id: '1'
      }
    };

    urlencoded.append('fb_api_req_friendly_name', 'AdAccountTimezoneUpdateMutation');
    urlencoded.append('variables', JSON.stringify(variables));
    urlencoded.append('doc_id', '4787981637941338'); // Example doc_id
    urlencoded.append('fb_api_caller_class', 'RelayModern');

    const response = await postFormData('https://www.facebook.com/api/graphql/', urlencoded);

    return {
      success: true,
      message: `Timezone updated to ${timezone} successfully`,
      data: response
    };

  } catch (error) {
    console.error('Error updating timezone:', error);
    return {
      success: false,
      message: error.message,
      error
    };
  }
}

/**
 * Show currency edit form
 */
export function showEditCurrencyForm() {
  const currencies = Object.keys(CONFIG.CURRENCY_SYMBOLS);

  const currencyOptions = currencies.map(code => {
    const symbol = CONFIG.CURRENCY_SYMBOLS[code];
    return `<option value="${code}">${code} (${symbol})</option>`;
  }).join('');

  const formHTML = `
    <div id="edit-currency-form">
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Select Currency:</label>
        <select id="currency-select"
                style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
          ${currencyOptions}
        </select>
      </div>

      <div style="text-align: right;">
        <button onclick="window.hidePluginPopup()"
                style="padding: 10px 20px; margin-right: 10px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">
          Cancel
        </button>
        <button onclick="window.processEditCurrency()"
                style="padding: 10px 20px; background: #1877f2; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Update Currency
        </button>
      </div>
    </div>
  `;

  showPopup('Edit Currency', formHTML);
}

/**
 * Show timezone edit form
 */
export function showEditTimezoneForm() {
  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Dubai',
    'Australia/Sydney'
  ];

  const timezoneOptions = timezones.map(tz => {
    return `<option value="${tz}">${tz.replace(/_/g, ' ')}</option>`;
  }).join('');

  const formHTML = `
    <div id="edit-timezone-form">
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Select Timezone:</label>
        <select id="timezone-select"
                style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
          ${timezoneOptions}
        </select>
      </div>

      <div style="text-align: right;">
        <button onclick="window.hidePluginPopup()"
                style="padding: 10px 20px; margin-right: 10px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">
          Cancel
        </button>
        <button onclick="window.processEditTimezone()"
                style="padding: 10px 20px; background: #1877f2; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Update Timezone
        </button>
      </div>
    </div>
  `;

  showPopup('Edit Timezone', formHTML);
}

/**
 * Get currency symbol for a currency code
 * @param {string} currencyCode - Currency code (e.g., 'USD')
 * @returns {string} Currency symbol
 */
export function getCurrencySymbol(currencyCode) {
  return CONFIG.CURRENCY_SYMBOLS[currencyCode] || currencyCode;
}

export default {
  updateAccountCurrency,
  updateAccountTimezone,
  showEditCurrencyForm,
  showEditTimezoneForm,
  getCurrencySymbol
};
