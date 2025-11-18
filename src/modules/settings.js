/**
 * Settings Management Module
 * Handles currency, timezone, and other account settings
 */

import { postFormData } from '../utils/http.js';
import { CONFIG } from '../core/config.js';
import { showPopup, hidePopup } from '../utils/dom.js';

/**
 * Update ad account currency
 * @param {string} accountId - Ad account ID
 * @param {string} currency - Currency code (e.g., 'USD')
 * @param {string} accessToken - Facebook access token
 * @returns {Promise<Object>} Result of update
 */
export async function updateAccountCurrency(accountId, currency, accessToken) {
  try {
    const apiUrl = `https://graph.facebook.com/${CONFIG.FB_API_VERSION}/act_${accountId}`;

    const urlencoded = new URLSearchParams();
    urlencoded.append('currency', currency.toUpperCase());
    urlencoded.append('access_token', accessToken);

    const response = await fetch(apiUrl, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      redirect: 'follow',
      body: urlencoded
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.error_user_msg || data.error.message);
    }

    return {
      success: true,
      message: `Currency updated to ${currency} successfully`,
      data
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
export async function updateAccountTimezone(accountId, timezoneId, accessToken) {
  try {
    const apiUrl = `https://graph.facebook.com/${CONFIG.FB_API_VERSION}/act_${accountId}`;

    const urlencoded = new URLSearchParams();
    urlencoded.append('timezone_id', timezoneId);
    urlencoded.append('access_token', accessToken);

    const response = await fetch(apiUrl, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      redirect: 'follow',
      body: urlencoded
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.error_user_msg || data.error.message);
    }

    return {
      success: true,
      message: `Timezone updated successfully`,
      data
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

  // Create form container using DOM methods (XSS-safe)
  const formContainer = document.createElement('div');
  formContainer.id = 'edit-currency-form';

  // Create select field container
  const fieldContainer = document.createElement('div');
  fieldContainer.style.marginBottom = '15px';

  const label = document.createElement('label');
  label.style.cssText = 'display: block; margin-bottom: 5px;';
  label.textContent = 'Select Currency:';

  const select = document.createElement('select');
  select.id = 'currency-select';
  select.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';

  // Add currency options
  currencies.forEach(code => {
    const symbol = CONFIG.CURRENCY_SYMBOLS[code];
    const option = document.createElement('option');
    option.value = code;
    option.textContent = `${code} (${symbol})`;
    select.appendChild(option);
  });

  fieldContainer.appendChild(label);
  fieldContainer.appendChild(select);

  // Create button container
  const buttonContainer = document.createElement('div');
  buttonContainer.style.textAlign = 'right';

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.style.cssText = 'padding: 10px 20px; margin-right: 10px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;';
  cancelButton.onclick = () => {
    if (window.hidePluginPopup) {
      window.hidePluginPopup();
    } else {
      hidePopup();
    }
  };

  const updateButton = document.createElement('button');
  updateButton.textContent = 'Update Currency';
  updateButton.style.cssText = 'padding: 10px 20px; background: #1877f2; color: white; border: none; border-radius: 4px; cursor: pointer;';
  updateButton.onclick = () => {
    if (window.processEditCurrency) {
      window.processEditCurrency();
    }
  };

  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(updateButton);

  // Assemble form
  formContainer.appendChild(fieldContainer);
  formContainer.appendChild(buttonContainer);

  showPopup('Edit Currency', formContainer);
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

  // Create form container using DOM methods (XSS-safe)
  const formContainer = document.createElement('div');
  formContainer.id = 'edit-timezone-form';

  // Create select field container
  const fieldContainer = document.createElement('div');
  fieldContainer.style.marginBottom = '15px';

  const label = document.createElement('label');
  label.style.cssText = 'display: block; margin-bottom: 5px;';
  label.textContent = 'Select Timezone:';

  const select = document.createElement('select');
  select.id = 'timezone-select';
  select.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';

  // Add timezone options
  timezones.forEach(tz => {
    const option = document.createElement('option');
    option.value = tz;
    option.textContent = tz.replace(/_/g, ' ');
    select.appendChild(option);
  });

  fieldContainer.appendChild(label);
  fieldContainer.appendChild(select);

  // Create button container
  const buttonContainer = document.createElement('div');
  buttonContainer.style.textAlign = 'right';

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.style.cssText = 'padding: 10px 20px; margin-right: 10px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;';
  cancelButton.onclick = () => {
    if (window.hidePluginPopup) {
      window.hidePluginPopup();
    } else {
      hidePopup();
    }
  };

  const updateButton = document.createElement('button');
  updateButton.textContent = 'Update Timezone';
  updateButton.style.cssText = 'padding: 10px 20px; background: #1877f2; color: white; border: none; border-radius: 4px; cursor: pointer;';
  updateButton.onclick = () => {
    if (window.processEditTimezone) {
      window.processEditTimezone();
    }
  };

  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(updateButton);

  // Assemble form
  formContainer.appendChild(fieldContainer);
  formContainer.appendChild(buttonContainer);

  showPopup('Edit Timezone', formContainer);
}

/**
 * Process currency edit form submission
 * Note: Requires PluginState to be available with accountId and accessToken
 */
export async function processEditCurrency() {
  const currencySelect = document.getElementById('currency-select');
  if (!currencySelect) {
    console.error('Currency select element not found');
    return;
  }

  const newCurrency = currencySelect.value;

  // Get account info from global state (for backward compatibility)
  const accountId = window.PluginState?.accountId || window.selectedacc;
  const accessToken = window.PluginState?.accessToken || window.privateToken;

  if (!accountId || !accessToken) {
    alert('Account information not available');
    return;
  }

  try {
    const result = await updateAccountCurrency(accountId, newCurrency, accessToken);

    if (result.success) {
      alert(`Currency updated to ${newCurrency} successfully!`);
      hidePopup();

      // Reload if mainreload is available
      if (window.mainreload) {
        window.mainreload();
      }
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error('Error processing currency update:', error);
    alert(`Error: ${error.message}`);
  }
}

/**
 * Process timezone edit form submission
 * Note: Requires PluginState to be available with accountId and accessToken
 */
export async function processEditTimezone() {
  const timezoneSelect = document.getElementById('timezone-select');
  if (!timezoneSelect) {
    console.error('Timezone select element not found');
    return;
  }

  const newTimezoneId = timezoneSelect.value;

  // Get account info from global state (for backward compatibility)
  const accountId = window.PluginState?.accountId || window.selectedacc;
  const accessToken = window.PluginState?.accessToken || window.privateToken;

  if (!accountId || !accessToken) {
    alert('Account information not available');
    return;
  }

  try {
    const result = await updateAccountTimezone(accountId, newTimezoneId, accessToken);

    if (result.success) {
      alert('Timezone updated successfully!');
      hidePopup();

      // Reload if mainreload is available
      if (window.mainreload) {
        window.mainreload();
      }
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error('Error processing timezone update:', error);
    alert(`Error: ${error.message}`);
  }
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
  processEditCurrency,
  processEditTimezone,
  getCurrencySymbol
};
