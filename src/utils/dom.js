/**
 * DOM Manipulation Utilities
 * Helper functions for DOM operations
 */

/**
 * Append content to a tab/element
 * @param {HTMLElement|Node} content - DOM element or node to append
 * @param {string} targetId - Target element ID
 *
 * SECURITY: This function only accepts DOM elements/nodes to prevent XSS attacks.
 * Do not pass HTML strings. Use createElement() to build your content safely.
 */
export function appendTab(content, targetId) {
  const element = document.getElementById(targetId);
  if (!element) {
    console.warn(`Element with ID "${targetId}" not found`);
    return;
  }

  if (content instanceof Node) {
    element.appendChild(content);
  } else {
    console.error('appendTab: content must be a DOM Node for security. HTML strings are not supported.');
  }
}

/**
 * Append content with additional processing
 * @param {HTMLElement|Node} content - DOM element or node to append
 * @param {string} targetId - Target element ID
 * @param {Function} callback - Optional callback after append
 *
 * SECURITY: This function only accepts DOM elements/nodes to prevent XSS attacks.
 */
export function appendTabPlus(content, targetId, callback) {
  appendTab(content, targetId);
  if (callback && typeof callback === 'function') {
    callback();
  }
}

/**
 * Create and show a modal/popup
 * @param {string} title - Popup title (will be safely escaped)
 * @param {HTMLElement|Node} content - DOM element or node for popup content
 * @param {Object} options - Popup options
 *
 * SECURITY: This function only accepts DOM elements/nodes for content to prevent XSS attacks.
 * Build your content using createElement() and DOM methods, not HTML strings.
 */
export function showPopup(title, content, options = {}) {
  const {
    width = '600px',
    height = 'auto',
    className = 'fb-plugin-popup'
  } = options;

  // Remove existing popup if any
  hidePopup();

  // Create popup container
  const popup = document.createElement('div');
  popup.id = 'fb-plugin-popup';
  popup.className = className;
  popup.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${width};
    max-height: 80vh;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 10000;
    overflow: auto;
  `;

  // Create main container
  const mainContainer = document.createElement('div');
  mainContainer.style.padding = '20px';

  // Create header container
  const headerContainer = document.createElement('div');
  headerContainer.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;';

  // Create title element (use textContent for XSS protection)
  const titleElement = document.createElement('h3');
  titleElement.style.margin = '0';
  titleElement.textContent = title; // Safe: uses textContent instead of innerHTML

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.style.cssText = 'background: none; border: none; font-size: 24px; cursor: pointer;';
  closeButton.textContent = '×';
  closeButton.onclick = () => {
    if (window.hidePluginPopup) {
      window.hidePluginPopup();
    } else {
      hidePopup();
    }
  };

  // Create content container
  const contentContainer = document.createElement('div');
  // Only accept DOM nodes for security
  if (content instanceof Node) {
    contentContainer.appendChild(content);
  } else {
    console.error('showPopup: content must be a DOM Node for security. HTML strings are not supported.');
    const errorMsg = document.createElement('p');
    errorMsg.textContent = 'Error: Invalid content provided';
    errorMsg.style.color = 'red';
    contentContainer.appendChild(errorMsg);
  }

  // Assemble the popup
  headerContainer.appendChild(titleElement);
  headerContainer.appendChild(closeButton);
  mainContainer.appendChild(headerContainer);
  mainContainer.appendChild(contentContainer);
  popup.appendChild(mainContainer);

  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'fb-plugin-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 9999;
  `;
  overlay.onclick = hidePopup;

  document.body.appendChild(overlay);
  document.body.appendChild(popup);
}

/**
 * Hide/close the popup
 */
export function hidePopup() {
  const popup = document.getElementById('fb-plugin-popup');
  const overlay = document.getElementById('fb-plugin-overlay');

  if (popup) popup.remove();
  if (overlay) overlay.remove();
}

/**
 * Toggle popup visibility
 */
export function togglePopup() {
  const popup = document.getElementById('fb-plugin-popup');
  if (popup) {
    hidePopup();
  }
}

export default {
  appendTab,
  appendTabPlus,
  showPopup,
  hidePopup,
  togglePopup
};
