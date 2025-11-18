/**
 * Business Manager Module
 * Handles operations related to Facebook Business Manager
 */

import { postFormData } from '../utils/http.js';
import { showPopup, hidePopup } from '../utils/dom.js';
import { CONFIG } from '../core/config.js';

/**
 * Add Business Manager
 * @param {string} bmName - Business Manager name
 * @param {string} accessToken - Facebook access token
 * @returns {Promise<Object>} Result of BM creation
 */
export async function addBusinessManager(bmName, accessToken) {
  try {
    const urlencoded = new URLSearchParams();
    urlencoded.append('access_token', accessToken);

    const variables = {
      input: {
        name: bmName,
        vertical: 'OTHER',
        timezone_id: '1',
        client_mutation_id: '1'
      }
    };

    urlencoded.append('fb_api_req_friendly_name', 'BusinessManagerCreateMutation');
    urlencoded.append('variables', JSON.stringify(variables));
    urlencoded.append('doc_id', CONFIG.GRAPHQL_DOC_IDS.BM_CREATE); // Example doc_id
    urlencoded.append('fb_api_caller_class', 'RelayModern');

    const response = await postFormData('https://www.facebook.com/api/graphql/', urlencoded);

    return {
      success: true,
      message: 'Business Manager created successfully',
      data: response
    };

  } catch (error) {
    console.error('Error creating Business Manager:', error);
    return {
      success: false,
      message: error.message,
      error
    };
  }
}

/**
 * Add user to Business Manager
 * @param {string} bmId - Business Manager ID
 * @param {string} userId - User ID to add
 * @param {string} role - User role (ADMIN, EMPLOYEE, etc.)
 * @param {string} accessToken - Facebook access token
 * @returns {Promise<Object>} Result of adding user
 */
export async function addUserToBusinessManager(bmId, userId, role, accessToken) {
  try {
    const urlencoded = new URLSearchParams();
    urlencoded.append('access_token', accessToken);

    const variables = {
      input: {
        business_id: bmId,
        user_id: userId,
        role: role || 'EMPLOYEE',
        client_mutation_id: '1'
      }
    };

    urlencoded.append('fb_api_req_friendly_name', 'BusinessAddUserMutation');
    urlencoded.append('variables', JSON.stringify(variables));
    urlencoded.append('doc_id', CONFIG.GRAPHQL_DOC_IDS.BM_ADD_USER); // Example doc_id
    urlencoded.append('fb_api_caller_class', 'RelayModern');

    const response = await postFormData('https://www.facebook.com/api/graphql/', urlencoded);

    return {
      success: true,
      message: 'User added to Business Manager successfully',
      data: response
    };

  } catch (error) {
    console.error('Error adding user to Business Manager:', error);
    return {
      success: false,
      message: error.message,
      error
    };
  }
}

/**
 * Add ad account to Business Manager
 * @param {string} bmId - Business Manager ID
 * @param {string} adAccountId - Ad account ID to add
 * @param {string} accessToken - Facebook access token
 * @returns {Promise<Object>} Result of adding account
 */
export async function addAdAccountToBusinessManager(bmId, adAccountId, accessToken) {
  try {
    const urlencoded = new URLSearchParams();
    urlencoded.append('access_token', accessToken);

    const variables = {
      input: {
        business_id: bmId,
        ad_account_id: adAccountId,
        permitted_tasks: ['MANAGE', 'ADVERTISE', 'ANALYZE'],
        client_mutation_id: '1'
      }
    };

    urlencoded.append('fb_api_req_friendly_name', 'BusinessAddAdAccountMutation');
    urlencoded.append('variables', JSON.stringify(variables));
    urlencoded.append('doc_id', CONFIG.GRAPHQL_DOC_IDS.BM_ADD_AD_ACCOUNT); // Example doc_id
    urlencoded.append('fb_api_caller_class', 'RelayModern');

    const response = await postFormData('https://www.facebook.com/api/graphql/', urlencoded);

    return {
      success: true,
      message: 'Ad account added to Business Manager successfully',
      data: response
    };

  } catch (error) {
    console.error('Error adding ad account to Business Manager:', error);
    return {
      success: false,
      message: error.message,
      error
    };
  }
}

/**
 * Request ad account access to Business Manager
 * @param {string} bmId - Business Manager ID
 * @param {string} adAccountId - Ad account ID to request
 * @param {string} accessToken - Facebook access token
 * @returns {Promise<Object>} Result of access request
 */
export async function requestAdAccountAccess(bmId, adAccountId, accessToken) {
  try {
    const urlencoded = new URLSearchParams();
    urlencoded.append('access_token', accessToken);

    const variables = {
      input: {
        business_id: bmId,
        ad_account_id: adAccountId,
        permitted_tasks: ['MANAGE', 'ADVERTISE', 'ANALYZE'],
        client_mutation_id: '1'
      }
    };

    urlencoded.append('fb_api_req_friendly_name', 'BusinessRequestAdAccountAccessMutation');
    urlencoded.append('variables', JSON.stringify(variables));
    urlencoded.append('doc_id', CONFIG.GRAPHQL_DOC_IDS.BM_REQUEST_AD_ACCOUNT); // Example doc_id
    urlencoded.append('fb_api_caller_class', 'RelayModern');

    const response = await postFormData('https://www.facebook.com/api/graphql/', urlencoded);

    return {
      success: true,
      message: 'Ad account access requested successfully',
      data: response
    };

  } catch (error) {
    console.error('Error requesting ad account access:', error);
    return {
      success: false,
      message: error.message,
      error
    };
  }
}

/**
 * Show add Business Manager form
 */
export function showAddBusinessManagerForm() {
  // Create form container using DOM methods (XSS-safe)
  const formContainer = document.createElement('div');
  formContainer.id = 'add-bm-form';

  // Create input field container
  const fieldContainer = document.createElement('div');
  fieldContainer.style.marginBottom = '15px';

  const label = document.createElement('label');
  label.style.cssText = 'display: block; margin-bottom: 5px;';
  label.textContent = 'Business Manager Name:';

  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'bm-name';
  input.placeholder = 'Enter Business Manager name';
  input.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';

  fieldContainer.appendChild(label);
  fieldContainer.appendChild(input);

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

  const createButton = document.createElement('button');
  createButton.textContent = 'Create BM';
  createButton.style.cssText = 'padding: 10px 20px; background: #1877f2; color: white; border: none; border-radius: 4px; cursor: pointer;';
  createButton.onclick = () => {
    if (window.processAddBusinessManager) {
      window.processAddBusinessManager();
    }
  };

  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(createButton);

  // Assemble form
  formContainer.appendChild(fieldContainer);
  formContainer.appendChild(buttonContainer);

  showPopup('Add Business Manager', formContainer);
}

/**
 * Process add Business Manager form submission
 */
export async function processAddBusinessManager() {
  const bmNameInput = document.getElementById('bm-name');
  if (!bmNameInput) {
    console.error('BM name input element not found');
    return;
  }

  const bmName = bmNameInput.value.trim();
  if (!bmName) {
    alert('Please enter a Business Manager name');
    return;
  }

  // Get access token from global state
  const accessToken = window.PluginState?.accessToken || window.privateToken;

  if (!accessToken) {
    alert('Access token not available');
    return;
  }

  try {
    const result = await addBusinessManager(bmName, accessToken);

    if (result.success) {
      alert(`Business Manager "${bmName}" created successfully!`);
      hidePopup();

      // Reload if mainreload is available
      if (window.mainreload) {
        window.mainreload();
      }
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error('Error processing BM creation:', error);
    alert(`Error: ${error.message}`);
  }
}

export default {
  addBusinessManager,
  addUserToBusinessManager,
  addAdAccountToBusinessManager,
  requestAdAccountAccess,
  showAddBusinessManagerForm,
  processAddBusinessManager
};
