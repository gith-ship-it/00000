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
    console.log('Not on ads manager page. Plugin will remain inactive until you navigate to ads manager.');
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
  document.addEventListener('keydown', function(evt) {
    // ESC key - close popup
    if (evt.key === 'Escape') {
      Popup.mainclose();
    }

    // Ctrl/Cmd + Shift + F - toggle popup
    if ((evt.ctrlKey || evt.metaKey) && evt.shiftKey && evt.key === 'f') {
      evt.preventDefault();
      Popup.togglePluginPopup();
    }
  });
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

  // Create account info container (XSS-safe using DOM methods)
  const infoContainer = document.createElement('div');
  infoContainer.style.cssText = 'padding: 10px; background: #f5f5f5; border-radius: 4px; margin-bottom: 10px;';

  // Create title
  const title = document.createElement('h4');
  title.style.cssText = 'margin: 0 0 10px 0;';
  title.textContent = 'Account Info';
  infoContainer.appendChild(title);

  // Helper function to create info paragraph
  const createInfoParagraph = (label, value) => {
    const p = document.createElement('p');
    p.style.cssText = 'margin: 5px 0;';

    const strong = document.createElement('strong');
    strong.textContent = label + ': ';

    const textNode = document.createTextNode(value || 'N/A');
    p.append(strong, textNode);

    return p;
  };

  // Add account info fields (all XSS-safe)
  infoContainer.append(
    createInfoParagraph('Name', accountData.name),
    createInfoParagraph('ID', accountData.id),
    createInfoParagraph('Status', accountData.account_status),
    createInfoParagraph('Currency', `${currencySymbol} ${accountData.currency || 'N/A'}`),
    createInfoParagraph('Timezone', accountData.timezone_name)
  );

  Tabs.setTab(infoContainer, 'dblock1');

  // Display funding source info
  if (accountData.funding_source_details) {
    const cardContainer = document.createElement('div');
    cardContainer.style.cssText = 'padding: 10px; background: #f5f5f5; border-radius: 4px;';

    const cardTitle = document.createElement('h4');
    cardTitle.style.cssText = 'margin: 0 0 10px 0;';
    cardTitle.textContent = 'Payment Method';
    cardContainer.appendChild(cardTitle);

    const cardP = document.createElement('p');
    cardP.style.cssText = 'margin: 5px 0;';

    const cardStrong = document.createElement('strong');
    cardStrong.textContent = 'Card: ';

    const cardText = document.createTextNode(accountData.funding_source_details.display_string || 'No card on file');

    const addLink = document.createElement('a');
    addLink.href = '#';
    addLink.setAttribute('data-action', 'add-credit-card');
    addLink.textContent = 'add';
    addLink.addEventListener('click', (e) => {
      e.preventDefault();
      CreditCard.showAddCreditCardForm();
    });

    cardP.append(cardStrong, cardText, ' [', addLink, ']');
    cardContainer.appendChild(cardP);

    Tabs.setTab(cardContainer, 'dblock1cc');
  }
}

/**
 * Expose API to window object for backward compatibility
 * WARNING: This function exposes internal APIs to the global namespace.
 * Only use this if you need backward compatibility with legacy code.
 * It is NOT called automatically to prevent namespace pollution.
 *
 * To use: Call window.FBACCPlugin.exposeGlobalAPI() manually if needed.
 */
function exposeGlobalAPI() {
  console.warn('FBACCPlugin: exposeGlobalAPI() is deprecated and pollutes the global namespace. Use the FBACCPlugin namespace instead.');

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
  window.hidePluginPopup = Popup.hidePluginPopup;

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
  window.processEditCurrency = Settings.processEditCurrency;
  window.processEditTimezone = Settings.processEditTimezone;

  // Business Manager
  window.processAddBusinessManager = BusinessManager.processAddBusinessManager;
}

/**
 * Main execution
 */
(function() {
  console.log('Facebook Ads Manager Plugin loading...');

  // Expose a single namespaced API instead of polluting global namespace
  window.FBACCPlugin = {
    // Core state and config (read-only access recommended)
    getState: () => ({ ...PluginState }),
    getConfig: () => ({ ...CONFIG }),

    // Auth methods
    Auth: {
      getAccessToken: Auth.getAccessToken,
      checkAuth: Auth.checkAuth
    },

    // Popup methods
    Popup: {
      close: Popup.mainclose,
      hide: Popup.mainhide,
      unhide: Popup.mainunhide,
      toggle: Popup.togglePluginPopup,
      show: Popup.showPluginPopup,
      hidePopup: Popup.hidePluginPopup
    },

    // Utilities
    Utils: {
      getCookie: Helpers.getCookie,
      getURLParameter: Helpers.getURLParameter,
      copyToClipboard: Helpers.copyToClipboard,
      shadowText: Helpers.shadowText,
      getJSON: HTTP.getJSON
    },

    // Feature modules
    AdAccount,
    CreditCard,
    Fanpage,
    BusinessManager,
    Settings,

    // For backward compatibility only (deprecated)
    exposeGlobalAPI,

    // Version info
    version: CONFIG.VERSION
  };

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();

export {
  PluginState,
  initialize,
  exposeGlobalAPI
};
