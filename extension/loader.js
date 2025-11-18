/**
 * Content Script Loader for Facebook Ads Manager Plugin
 *
 * This loader script runs in the isolated content script context and
 * injects the main plugin script into the page's main world, allowing
 * it to access the page's JavaScript context and exposeGlobalAPI() function.
 */

(function() {
  'use strict';

  // Get the URL of the bundled plugin script from the extension
  const scriptUrl = chrome.runtime.getURL('fbacc-plugin.min.js');

  // Create a script element to inject into the main world
  const script = document.createElement('script');
  script.src = scriptUrl;
  script.type = 'text/javascript';

  // Add error handling
  script.onerror = function() {
    console.error('[FBACC Plugin] Failed to load plugin script');
  };

  script.onload = function() {
    console.log('[FBACC Plugin] Plugin script loaded successfully');
  };

  // Inject the script into the page's main world
  // Use document.head for better reliability, fall back to documentElement
  (document.head || document.documentElement).appendChild(script);

  // Optional: Remove the script element after injection to clean up DOM
  // The script will continue to execute even after the element is removed
  script.onload = function() {
    console.log('[FBACC Plugin] Plugin script loaded successfully');
    script.remove();
  };
})();
