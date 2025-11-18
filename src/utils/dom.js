/**
 * DOM Manipulation Utilities
 * Helper functions for DOM operations
 */

/**
 * Append content to a tab/element
 * @param {string|HTMLElement} content - Content to append (HTML string or DOM element)
 * @param {string} targetId - Target element ID
 */
export function appendTab(content, targetId) {
  const element = document.getElementById(targetId);
  if (element) {
    if (typeof content === 'string') {
      // Create a temporary container to parse HTML safely
      const temp = document.createElement('div');
      temp.innerHTML = content;
      // Append all child nodes
      while (temp.firstChild) {
        element.appendChild(temp.firstChild);
      }
    } else if (content instanceof HTMLElement) {
      element.appendChild(content);
    }
  }
}

/**
 * Append content with additional processing
 * @param {string} content - HTML content to append
 * @param {string} targetId - Target element ID
 * @param {Function} callback - Optional callback after append
 */
export function appendTabPlus(content, targetId, callback) {
  appendTab(content, targetId);
  if (callback && typeof callback === 'function') {
    callback();
  }
}

/**
 * Create and show a modal/popup
 * @param {string} title - Popup title (will be escaped)
 * @param {string} content - Popup content (HTML - must be sanitized by caller if contains user data)
 * @param {Object} options - Popup options
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
  // Note: innerHTML is used here, but caller must ensure content is sanitized
  contentContainer.innerHTML = content;

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
