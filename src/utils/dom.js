/**
 * DOM Manipulation Utilities
 * Helper functions for DOM operations
 */

/**
 * Append content to a tab/element
 * @param {string} content - HTML content to append
 * @param {string} targetId - Target element ID
 */
export function appendTab(content, targetId) {
  const element = document.getElementById(targetId);
  if (element) {
    element.innerHTML += content;
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
 * @param {string} title - Popup title
 * @param {string} content - Popup content (HTML)
 * @param {Object} options - Popup options
 * @returns {HTMLElement} The popup element for direct event listener attachment
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

  popup.innerHTML = `
    <div style="padding: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3 style="margin: 0;">${title}</h3>
        <button data-action="close-popup" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
      </div>
      <div>${content}</div>
    </div>
  `;

  // Add event listener to close button
  const closeButton = popup.querySelector('[data-action="close-popup"]');
  if (closeButton) {
    closeButton.addEventListener('click', hidePopup);
  }

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
  overlay.addEventListener('click', hidePopup);

  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  return popup;
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
