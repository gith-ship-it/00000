/**
 * Credit Card Management Module
 * Handles adding and managing payment methods for ad accounts
 */

import { graphQLRequest } from '../core/api.js';
import { showPopup, hidePopup } from '../utils/dom.js';
import { CONFIG } from '../core/config.js';
import { createFormField } from '../ui/tabs.js';

/**
 * Add credit card to ad account using GraphQL mutation.
 * @param {string} adAccountId - Ad account ID
 * @param {string} fbSocialId - Facebook social/user ID (actor ID)
 * @param {string} ccNumber - Credit card number
 * @param {string} ccYear - Expiration year (YYYY)
 * @param {string} ccMonth - Expiration month (MM)
 * @param {string} ccCVC - Card CVC code
 * @param {string} ccIso - Country ISO code (e.g. 'US')
 * @param {string} accessToken - Facebook access token
 * @param {Object} context - Plugin context (dtsg, userId)
 * @returns {Promise<Object>} Result of the operation
 * @property {boolean} success - Whether the operation was successful
 * @property {string} message - Result message
 * @property {Object} [data] - Response data from GraphQL
 * @property {Object} [error] - Error details if failed
 */
export async function addCreditCardToAccount(
  adAccountId,
  fbSocialId,
  ccNumber,
  ccYear,
  ccMonth,
  ccCVC,
  ccIso,
  accessToken,
  context = {}
) {
  try {
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

    // We are passing paymentAccountID as context here if API logic supported it directly,
    // but based on api.js refactor, we only extract dtsg and userId from context.
    // If specific mutation needs extra query params, api.js should be updated or we assume
    // graphQLRequest handles standard params.
    // NOTE: Original code added `paymentAccountID` to extraParams.
    // decompressed_fbacc.js uses `useBillingAddCreditCardMutation` but does NOT seem to add paymentAccountID
    // to the top-level form data, only inside variables.
    // The original src/modules/creditCard.js added { paymentAccountID: adAccountId } to extraParams.
    // Since my api.js refactor REMOVED extraParams loop, this parameter would be lost.
    // Let's check if it is really needed.
    // In decompressed_fbacc.js:
    // urlencoded.append("variables", '{"input":{"payment_account_id":"'+ adAccId +'"...}}');
    // It does NOT append payment_account_id to the body outside variables.
    // So the extraParams in original source might have been superfluous or for a different API version.
    // I will proceed with just context.

    const result = await graphQLRequest(
      CONFIG.GRAPHQL_DOC_IDS.ADD_CREDIT_CARD,
      variables,
      'useFBAAddCreditCardMutation',
      accessToken,
      context
    );

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
 * Show the "Add Credit Card" form in a popup.
 * Creates the form elements dynamically and displays them using the popup utility.
 * @returns {void}
 */
export function showAddCreditCardForm(context = {}) {
  // Create form container using DOM methods (XSS-safe)
  const formContainer = document.createElement('div');
  formContainer.id = 'add-cc-form';

  // Store context on the form container for processing
  formContainer.dataset.context = JSON.stringify(context);

  // Card number field
  formContainer.appendChild(
    createFormField('Card Number:', 'cc-number', { placeholder: '1234 5678 9012 3456' })
  );

  // Grid container for month, year, CVC
  const gridContainer = document.createElement('div');
  gridContainer.style.cssText =
    'display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 15px;';

  const monthField = createFormField('Month:', 'cc-month', { placeholder: 'MM' });
  monthField.style.marginBottom = '0';

  const yearField = createFormField('Year:', 'cc-year', { placeholder: 'YYYY' });
  yearField.style.marginBottom = '0';

  const cvcField = createFormField('CVC:', 'cc-cvc', { placeholder: '123' });
  cvcField.style.marginBottom = '0';

  gridContainer.append(monthField, yearField, cvcField);

  formContainer.appendChild(gridContainer);

  // Country code field
  formContainer.appendChild(createFormField('Country Code:', 'cc-country', { placeholder: 'US' }));

  // Button container
  const buttonContainer = document.createElement('div');
  buttonContainer.style.textAlign = 'right';

  const cancelButton = document.createElement('button');
  cancelButton.setAttribute('data-action', 'cancel');
  cancelButton.textContent = 'Cancel';
  cancelButton.style.cssText =
    'padding: 10px 20px; margin-right: 10px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;';
  cancelButton.addEventListener('click', hidePopup);

  const addButton = document.createElement('button');
  addButton.setAttribute('data-action', 'submit');
  addButton.textContent = 'Add Card';
  addButton.style.cssText =
    'padding: 10px 20px; background: #1877f2; color: white; border: none; border-radius: 4px; cursor: pointer;';
  addButton.addEventListener('click', processCreditCardForm);
  buttonContainer.append(cancelButton, addButton);
  formContainer.appendChild(buttonContainer);

  showPopup('Add Credit Card', formContainer);
}

/**
 * Process the credit card form submission.
 * Validates input, retrieves global state, and calls addCreditCardToAccount.
 * @returns {Promise<void>}
 */
export async function processCreditCardForm(context = {}) {
  const ccNumber = document.getElementById('cc-number')?.value;
  const ccMonth = document.getElementById('cc-month')?.value;
  const ccYear = document.getElementById('cc-year')?.value;
  const ccCVC = document.getElementById('cc-cvc')?.value;
  const ccCountry = document.getElementById('cc-country')?.value;

  // Try to get context from form data if not provided
  if (!context.accessToken) {
      const form = document.getElementById('add-cc-form');
      if (form && form.dataset.context) {
          try {
              context = JSON.parse(form.dataset.context);
          } catch (e) { console.error('Failed to parse context', e); }
      }
  }

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

  // Get account info from context or global window state fallback (legacy)
  const accountId = context.accountId || window.selectedacc;
  const socialId = context.userId || window.socid;
  const accessToken = context.accessToken || window.privateToken;

  if (!accountId || !socialId || !accessToken) {
    showError('Account information not available. Please reload the page.');
    return;
  }

  try {
    // We shouldn't hide popup immediately to allow error showing
    // hidePopup();

    const result = await addCreditCardToAccount(
      accountId,
      socialId,
      cleanNumber,
      ccYear,
      ccMonth,
      ccCVC,
      ccCountry.toUpperCase(),
      accessToken,
      context
    );

    if (result.success) {
      hidePopup();
      alert('Credit card added successfully!');

      // Reload if mainreload is available
      if (window.mainreload) {
        window.mainreload();
      } else {
          // Maybe refresh the ad account details logic here if possible
          location.reload();
      }
    } else {
      showError(`Error adding credit card: ${result.message}`);
    }
  } catch (error) {
    console.error('Error processing credit card form:', error);
    showError(`Error: ${error.message}`);
  }
}

/**
 * Show error message in the credit card form.
 * @param {string} message - Error message to display
 * @returns {void}
 */
function showError(message) {
  // Try to find or create error display element
  let errorDiv = document.getElementById('cc-form-error');

  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.id = 'cc-form-error';
    errorDiv.style.cssText =
      'color: red; margin-bottom: 10px; padding: 10px; background: #fee; border-radius: 4px;';

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
