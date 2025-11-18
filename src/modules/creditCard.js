/**
 * Credit Card Management Module
 * Handles adding and managing payment methods for ad accounts
 */

import { graphQLRequest } from '../utils/http.js';
import { showPopup, hidePopup, appendTab } from '../utils/dom.js';

import { CONFIG } from '../core/config.js';
/**
 * Add credit card to ad account
 * @param {string} adAccountId - Ad account ID
 * @param {string} fbSocialId - Facebook social ID
 * @param {string} ccNumber - Credit card number
 * @param {string} ccYear - Expiration year
 * @param {string} ccMonth - Expiration month
 * @param {string} ccCVC - Card CVC
 * @param {string} ccIso - Country ISO code
 * @param {string} accessToken - Facebook access token
 * @returns {Promise<Object>} Result of the operation
 */
export async function addCreditCardToAccount(
  adAccountId,
  fbSocialId,
  ccNumber,
  ccYear,
  ccMonth,
  ccCVC,
  ccIso,
  accessToken
) {
  try {
    const urlencoded = new URLSearchParams();
    urlencoded.append('access_token', accessToken);
    urlencoded.append('paymentAccountID', adAccountId);

    const variables = {
      input: {
        credit_card_id: adAccountId,
        payment_type: 'MOR_ADS_INVOICE',
        new_credit_card: {
          credit_card_number: ccNumber,
          platform_trust_token: null,
          csc: ccCVC,
          expiry_month: parseInt(ccMonth),
          expiry_year: parseInt(ccYear),
          billing_address: {
            country_code: ccIso
          }
        },
        actor_id: fbSocialId,
        client_mutation_id: Date.now().toString()
      }
    };

    urlencoded.append('fb_api_req_friendly_name', 'useFBAAddCreditCardMutation');
    urlencoded.append('variables', JSON.stringify(variables));
    urlencoded.append('doc_id', CONFIG.GRAPHQL_DOC_IDS.ADD_CREDIT_CARD);
    urlencoded.append('fb_api_caller_class', 'RelayModern');

    const response = await fetch('https://www.facebook.com/api/graphql/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: urlencoded
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'Failed to add credit card');
    }

    return {
      success: true,
      message: 'Credit card added successfully',
      data: result
    };

  } catch (error) {
    console.error('Error adding credit card:', error);
    return {
      success: false,
      message: error.message,
      error
    };
  }
}

/**
 * Show add credit card form
 */
export function showAddCreditCardForm() {
  const formHTML = `
    <div id="add-cc-form">
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Card Number:</label>
        <input type="text" id="cc-number" placeholder="1234 5678 9012 3456"
               style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 15px;">
        <div>
          <label style="display: block; margin-bottom: 5px;">Month:</label>
          <input type="text" id="cc-month" placeholder="MM" maxlength="2"
                 style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
        </div>
        <div>
          <label style="display: block; margin-bottom: 5px;">Year:</label>
          <input type="text" id="cc-year" placeholder="YYYY" maxlength="4"
                 style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
        </div>
        <div>
          <label style="display: block; margin-bottom: 5px;">CVC:</label>
          <input type="text" id="cc-cvc" placeholder="123" maxlength="4"
                 style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
        </div>
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Country Code:</label>
        <input type="text" id="cc-country" placeholder="US" maxlength="2"
               style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
      </div>

      <div style="text-align: right;">
        <button data-action="cancel"
                style="padding: 10px 20px; margin-right: 10px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">
          Cancel
        </button>
        <button data-action="submit"
                style="padding: 10px 20px; background: #1877f2; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Add Card
        </button>
      </div>
    </div>
  `;

  showPopup('Add Credit Card', formHTML);

  // Add event listeners after popup is created
  setTimeout(() => {
    const cancelButton = document.querySelector('#add-cc-form [data-action="cancel"]');
    const submitButton = document.querySelector('#add-cc-form [data-action="submit"]');

    if (cancelButton) {
      cancelButton.addEventListener('click', hidePopup);
    }

    if (submitButton) {
      submitButton.addEventListener('click', processCreditCardForm);
    }
  }, 0);
}

/**
 * Process credit card form submission
 */
export async function processCreditCardForm() {
  const ccNumber = document.getElementById('cc-number')?.value;
  const ccMonth = document.getElementById('cc-month')?.value;
  const ccYear = document.getElementById('cc-year')?.value;
  const ccCVC = document.getElementById('cc-cvc')?.value;
  const ccCountry = document.getElementById('cc-country')?.value;

  // Validation
  if (!ccNumber || !ccMonth || !ccYear || !ccCVC || !ccCountry) {
    showError('Please fill in all fields');
    return;
  }

  const cleanNumber = ccNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(cleanNumber)) {
    showError('Invalid card number. Must be 13-19 digits.');
    return;
  }

  if (!/^\d{2}$/.test(ccMonth) || parseInt(ccMonth) < 1 || parseInt(ccMonth) > 12) {
    showError('Invalid month. Must be 01-12.');
    return;
  }

  const currentYear = new Date().getFullYear();
  if (!/^\d{4}$/.test(ccYear) || parseInt(ccYear) < currentYear) {
    showError('Invalid year. Must be current year or later.');
    return;
  }

  if (!/^\d{3,4}$/.test(ccCVC)) {
    showError('Invalid CVC. Must be 3 or 4 digits.');
    return;
  }

  // Get account info from global state
  const accountId = window.PluginState?.accountId || window.selectedacc;
  const socialId = window.PluginState?.socialId || window.socid;
  const accessToken = window.PluginState?.accessToken || window.privateToken;

  if (!accountId || !socialId || !accessToken) {
    showError('Account information not available. Please reload the page.');
    return;
  }

  try {
    hidePopup();

    const result = await addCreditCardToAccount(
      accountId,
      socialId,
      cleanNumber,
      ccYear,
      ccMonth,
      ccCVC,
      ccCountry.toUpperCase(),
      accessToken
    );

    if (result.success) {
      alert('Credit card added successfully!');

      // Reload if mainreload is available
      if (window.mainreload) {
        window.mainreload();
      }
    } else {
      alert(`Error adding credit card: ${result.message}`);
    }
  } catch (error) {
    console.error('Error processing credit card form:', error);
    alert(`Error: ${error.message}`);
  }
}

/**
 * Show error message in form
 * @param {string} message - Error message
 */
function showError(message) {
  // Try to find or create error display element
  let errorDiv = document.getElementById('cc-form-error');

  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.id = 'cc-form-error';
    errorDiv.style.cssText = 'color: red; margin-bottom: 10px; padding: 10px; background: #fee; border-radius: 4px;';

    const form = document.getElementById('add-cc-form');
    if (form) {
      form.insertBefore(errorDiv, form.firstChild);
    } else {
      alert(message);
      return;
    }
  }

  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}

export default {
  addCreditCardToAccount,
  showAddCreditCardForm,
  processCreditCardForm
};
