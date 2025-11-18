/**
 * Tabs UI Component
 * Manages content tabs within the plugin popup
 */

/**
 * Append content to a tab
 * @param {string} content - HTML content to append
 * @param {string} tabId - Tab element ID
 */
export function appendTab(content, tabId) {
  const element = document.getElementById(tabId);
  if (element) {
    element.innerHTML += content;
  } else {
    console.warn(`Tab element with ID "${tabId}" not found`);
  }
}

/**
 * Append content to tab with callback
 * @param {string} content - HTML content to append
 * @param {string} tabId - Tab element ID
 * @param {Function} callback - Callback after appending
 */
export function appendTabPlus(content, tabId, callback) {
  appendTab(content, tabId);
  if (callback && typeof callback === 'function') {
    callback();
  }
}

/**
 * Clear tab content
 * @param {string} tabId - Tab element ID
 */
export function clearTab(tabId) {
  const element = document.getElementById(tabId);
  if (element) {
    element.innerHTML = '';
  }
}

/**
 * Set tab content (replace existing content)
 * @param {string} content - HTML content to set
 * @param {string} tabId - Tab element ID
 */
export function setTab(content, tabId) {
  const element = document.getElementById(tabId);
  if (element) {
    element.innerHTML = content;
  }
}

/**
 * Create a button element
 * @param {string} text - Button text
 * @param {Function|string} onClick - Click handler or onclick string
 * @param {Object} options - Button options
 * @returns {string} Button HTML
 */
export function createButton(text, onClick, options = {}) {
  const {
    style = 'primary',
    size = 'medium',
    className = ''
  } = options;

  const styles = {
    primary: 'background: #1877f2; color: white; border: none;',
    secondary: 'background: white; color: #1877f2; border: 1px solid #1877f2;',
    danger: 'background: #dc3545; color: white; border: none;',
    success: 'background: #28a745; color: white; border: none;'
  };

  const sizes = {
    small: 'padding: 5px 10px; font-size: 12px;',
    medium: 'padding: 8px 16px; font-size: 14px;',
    large: 'padding: 12px 24px; font-size: 16px;'
  };

  const baseStyle = 'border-radius: 4px; cursor: pointer; font-weight: 500;';
  const buttonStyle = `${baseStyle} ${styles[style] || styles.primary} ${sizes[size] || sizes.medium}`;

  const onClickAttr = typeof onClick === 'string'
    ? onClick
    : `onclick="${onClick.toString()}(); return false;"`;

  return `<button style="${buttonStyle}" class="${className}" ${onClickAttr}>${text}</button>`;
}

/**
 * Create a form field
 * @param {string} label - Field label
 * @param {string} id - Input ID
 * @param {Object} options - Field options
 * @returns {string} Form field HTML
 */
export function createFormField(label, id, options = {}) {
  const {
    type = 'text',
    placeholder = '',
    required = false,
    value = ''
  } = options;

  return `
    <div style="margin-bottom: 15px;">
      <label for="${id}" style="display: block; margin-bottom: 5px; font-weight: 500;">
        ${label}${required ? ' <span style="color: red;">*</span>' : ''}
      </label>
      <input
        type="${type}"
        id="${id}"
        placeholder="${placeholder}"
        value="${value}"
        ${required ? 'required' : ''}
        style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
    </div>
  `;
}

export default {
  appendTab,
  appendTabPlus,
  clearTab,
  setTab,
  createButton,
  createFormField
};
