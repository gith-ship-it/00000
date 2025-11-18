/**
 * Facebook Ads Manager Plugin - Main Entry Point
 * Version: 6.4
 *
 * This is the main entry point for the Facebook Ads Manager plugin.
 * It initializes the plugin and sets up all necessary event handlers.
 */

import CONFIG from './core/config.js';
import * as Auth from './core/auth.js';
import * as API from './core/api.js';

import * as AdAccount from './modules/adAccount.js';
import * as CreditCard from './modules/creditCard.js';
import * as Fanpage from './modules/fanpage.js';
import * as BusinessManager from './modules/businessManager.js';
import * as Settings from './modules/settings.js';

import * as Popup from './ui/popup.js';
import * as Tabs from './ui/tabs.js';

import * as Helpers from './utils/helpers.js';
import * as HTTP from './utils/http.js';
import * as DOM from './utils/dom.js';

/**
 * Plugin state
 */
const PluginState = {
  initialized: false,
  accessToken: null,
  accountId: null,
  isPageAuth: false
};

/**
 * Check if current page is a valid path for plugin activation
 * @returns {boolean}
 */
function isValidPath() {
  return CONFIG.VALID_PATHS.some(path =>
    window.location.pathname === path
  );
}

/**
 * Initialize the plugin
 */
function initialize() {
  console.log(`Facebook Ads Manager Plugin v${CONFIG.VERSION}`);

  // Check if we're on a valid page
  if (!isValidPath()) {
    console.log('Not on ads manager page, checking if on Facebook...');

    if (window.location.host.indexOf('facebook.com') > -1) {
      // Redirect to ads manager
      window.location.href = '/adsmanager/manage/campaigns';
    } else {
      // Ask user to open Facebook ads manager
      if (confirm('Are you sure you want to open Facebook Ads Manager?')) {
        window.location.href = 'https://www.facebook.com/adsmanager/manage/campaigns';
      }
    }
    return;
  }

  // Get access token
  const tokenInfo = Auth.getAccessToken();
  PluginState.accessToken = tokenInfo.token;
  PluginState.accountId = tokenInfo.accountId;
  PluginState.isPageAuth = tokenInfo.isPageAuth;

  if (!PluginState.accessToken) {
    console.error('Failed to get access token');
    return;
  }

  console.log('Access token obtained successfully');

  // Initialize UI
  Popup.initPluginPopup();

  // Setup keyboard shortcuts
  setupKeyboardShortcuts();

  // Load initial data
  loadInitialData();

  // Mark as initialized
  PluginState.initialized = true;

  console.log('Plugin initialized successfully');
}

/**
 * Setup keyboard shortcuts
 */
function setupKeyboardShortcuts() {
  document.onkeydown = function(evt) {
    evt = evt || window.event;

    // ESC key - close popup
    if (evt.keyCode === 27) {
      Popup.mainclose();
    }

    // Ctrl/Cmd + Shift + F - toggle popup
    if ((evt.ctrlKey || evt.metaKey) && evt.shiftKey && evt.keyCode === 70) {
      evt.preventDefault();
      Popup.togglePluginPopup();
    }
  };
}

/**
 * Load initial data and populate UI
 */
async function loadInitialData() {
  try {
    // Check authentication status
    Auth.checkAuth();

    // Load account information if available
    if (PluginState.accountId) {
      const accountDetails = await AdAccount.getAdAccountDetails(
        PluginState.accountId,
        PluginState.accessToken
      );

      if (accountDetails.success) {
        displayAccountInfo(accountDetails.data);
      }
    }

    // Show plugin popup
    Popup.showPluginPopup();

  } catch (error) {
    console.error('Error loading initial data:', error);
  }
}

/**
 * Display account information in the popup
 * @param {Object} accountData - Account data from API
 */
function displayAccountInfo(accountData) {
  const currencySymbol = Settings.getCurrencySymbol(accountData.currency);

  const infoHTML = `
    <div style="padding: 10px; background: #f5f5f5; border-radius: 4px; margin-bottom: 10px;">
      <h4 style="margin: 0 0 10px 0;">Account Info</h4>
      <p style="margin: 5px 0;"><strong>Name:</strong> ${accountData.name || 'N/A'}</p>
      <p style="margin: 5px 0;"><strong>ID:</strong> ${accountData.id || 'N/A'}</p>
      <p style="margin: 5px 0;"><strong>Status:</strong> ${accountData.account_status || 'N/A'}</p>
      <p style="margin: 5px 0;"><strong>Currency:</strong> ${currencySymbol} ${accountData.currency || 'N/A'}</p>
      <p style="margin: 5px 0;"><strong>Timezone:</strong> ${accountData.timezone_name || 'N/A'}</p>
    </div>
  `;

  Tabs.setTab(infoHTML, 'dblock1');

  // Display funding source info
  if (accountData.funding_source_details) {
    const cardHTML = `
      <div style="padding: 10px; background: #f5f5f5; border-radius: 4px;">
        <h4 style="margin: 0 0 10px 0;">Payment Method</h4>
        <p style="margin: 5px 0;">
          <strong>Card:</strong> ${accountData.funding_source_details.display_string || 'No card on file'}
          &nbsp;[<a href="#" onclick="window.showAddCreditCardForm(); return false;">add</a>]
        </p>
      </div>
    `;

    Tabs.setTab(cardHTML, 'dblock1cc');
  }
}

/**
 * Expose API to window object for backward compatibility
 */
function exposeGlobalAPI() {
  // Core
  window.PluginState = PluginState;
  window.CONFIG = CONFIG;

  // Auth
  window.getAccessToken = Auth.getAccessToken;
  window.checkauth = Auth.checkAuth;

  // Popup
  window.mainclose = Popup.mainclose;
  window.mainhide = Popup.mainhide;
  window.mainunhide = Popup.mainunhide;
  window.togglePluginPopup = Popup.togglePluginPopup;
  window.showPluginPopup = Popup.showPluginPopup;
  window.hidePluginPopup = Popup.hidePopup;

  // Tabs
  window.appendtab = Tabs.appendTab;
  window.appendtabplus = Tabs.appendTabPlus;

  // Utilities
  window.getCookie = Helpers.getCookie;
  window.getURLParameter = Helpers.getURLParameter;
  window.copytocb = Helpers.copyToClipboard;
  window.shadowtext = Helpers.shadowText;
  window.getJSON = HTTP.getJSON;

  // Credit Card
  window.showAddCreditCardForm = CreditCard.showAddCreditCardForm;
  window.processCreditCardForm = CreditCard.processCreditCardForm;
  window.addCreditCardToAccount = CreditCard.addCreditCardToAccount;

  // Ad Account
  window.appealadsacc = AdAccount.appealAdAccount;
  window.deladacc = AdAccount.deleteAdAccount;
  window.remadacc = AdAccount.removeAdAccountAccess;

  // Fanpage
  window.appealfp = Fanpage.appealFanpage;
  window.delfp = Fanpage.deleteFanpage;
  window.unhidefp = Fanpage.unhideFanpage;

  // Business Manager
  window.showAddBM = BusinessManager.showAddBusinessManagerForm;

  // Settings
  window.ShowEditcurr = Settings.showEditCurrencyForm;
  window.ShowEdittzone = Settings.showEditTimezoneForm;
}

/**
 * Main execution
 */
(function() {
  console.log('Facebook Ads Manager Plugin loading...');

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      exposeGlobalAPI();
      initialize();
    });
  } else {
    exposeGlobalAPI();
    initialize();
  }
})();

export {
  PluginState,
  initialize,
  exposeGlobalAPI
};
