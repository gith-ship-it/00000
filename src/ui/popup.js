/**
 * Popup UI Component
 * Manages plugin popup windows and overlays
 */

/**
 * Get popup coordinates centered on screen
 * @param {number} width - Popup width
 * @param {number} height - Popup height
 * @returns {Object} Coordinates {left, top}
 */
export function getPopupCoords(width = 800, height = 600) {
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;

  return { left, top };
}

/**
 * Initialize main plugin popup
 */
export function initPluginPopup() {
  // Remove existing popup if any
  destroyPluginPopup();

  const popup = document.createElement('div');
  popup.id = 'fb-ads-plugin-popup';
  popup.style.cssText = `
    position: fixed;
    top: 60px;
    right: 20px;
    width: 400px;
    max-height: calc(100vh - 100px);
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    z-index: 9999;
    overflow: auto;
    display: none;
  `;

  // Create header container
  const headerContainer = document.createElement('div');
  headerContainer.style.cssText = 'padding: 15px; border-bottom: 1px solid #ddd;';

  const headerInner = document.createElement('div');
  headerInner.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';

  // Create title
  const title = document.createElement('h3');
  title.style.cssText = 'margin: 0; font-size: 16px;';
  title.textContent = 'FB Ads Manager Plugin';

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.style.cssText = 'background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; width: 30px; height: 30px;';
  closeButton.textContent = '×';
  closeButton.onclick = () => {
    if (window.mainclose) {
      window.mainclose();
    }
  };

  headerInner.appendChild(title);
  headerInner.appendChild(closeButton);
  headerContainer.appendChild(headerInner);

  // Create content container
  const contentContainer = document.createElement('div');
  contentContainer.id = 'plugin-content';
  contentContainer.style.cssText = 'padding: 15px;';

  // Create content blocks
  const blockIds = ['dblock1', 'dblock1cc', 'dblock2', 'dblock3', 'dblock4'];
  blockIds.forEach(id => {
    const block = document.createElement('div');
    block.id = id;
    block.style.marginBottom = '15px';
    contentContainer.appendChild(block);
  });

  // Assemble popup
  popup.appendChild(headerContainer);
  popup.appendChild(contentContainer);
  document.body.appendChild(popup);
}

/**
 * Show plugin popup
 */
export function showPluginPopup() {
  const popup = document.getElementById('fb-ads-plugin-popup');
  if (popup) {
    popup.style.display = 'block';
  } else {
    initPluginPopup();
    showPluginPopup();
  }
}

/**
 * Hide plugin popup
 */
export function hidePluginPopup() {
  const popup = document.getElementById('fb-ads-plugin-popup');
  if (popup) {
    popup.style.display = 'none';
  }
}

/**
 * Toggle plugin popup visibility
 */
export function togglePluginPopup() {
  const popup = document.getElementById('fb-ads-plugin-popup');
  if (!popup) {
    initPluginPopup();
    showPluginPopup();
    return;
  }

  if (popup.style.display === 'none' || popup.style.display === '') {
    showPluginPopup();
  } else {
    hidePluginPopup();
  }
}

/**
 * Destroy plugin popup
 */
export function destroyPluginPopup() {
  const popup = document.getElementById('fb-ads-plugin-popup');
  if (popup) {
    popup.remove();
  }
}

/**
 * Close main popup (alias for hide)
 */
export function mainclose() {
  hidePluginPopup();
}

/**
 * Hide main popup (alias for hide)
 */
export function mainhide() {
  hidePluginPopup();
}

/**
 * Unhide main popup (alias for show)
 */
export function mainunhide() {
  showPluginPopup();
}

export default {
  getPopupCoords,
  initPluginPopup,
  showPluginPopup,
  hidePluginPopup,
  togglePluginPopup,
  destroyPluginPopup,
  mainclose,
  mainhide,
  mainunhide
};
