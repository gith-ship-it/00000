/**
 * Tabs UI Component
 * Manages content tabs within the plugin popup
 */

/**
 * Append content to a tab
 * @param {HTMLElement|Node} content - DOM element or node to append
 * @param {string} tabId - Tab element ID
 *
 * SECURITY: This function only accepts DOM elements/nodes to prevent XSS attacks.
 * Do not pass HTML strings. Use createElement() to build your content safely.
 */
export function appendTab(content, tabId) {
  const element = document.getElementById(tabId);
  if (!element) {
    console.warn(`Tab element with ID "${tabId}" not found`);
    return;
  }

  if (content instanceof Node) {
    element.appendChild(content);
  } else {
    console.error('appendTab: content must be a DOM Node for security. HTML strings are not supported.');
  }
}

/**
 * Append content to tab with callback
 * @param {HTMLElement|Node} content - DOM element or node to append
 * @param {string} tabId - Tab element ID
 * @param {Function} callback - Callback after appending
 *
 * SECURITY: This function only accepts DOM elements/nodes to prevent XSS attacks.
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
    // Safe: clearing content, no XSS risk
    element.textContent = '';
  }
}

/**
 * Set tab content (replace existing content)
 * @param {HTMLElement|Node} content - DOM element or node to set
 * @param {string} tabId - Tab element ID
 *
 * SECURITY: This function only accepts DOM elements/nodes to prevent XSS attacks.
 * Do not pass HTML strings. Use createElement() to build your content safely.
 */
export function setTab(content, tabId) {
  const element = document.getElementById(tabId);
  if (!element) {
    console.warn(`Tab element with ID "${tabId}" not found`);
    return;
  }

  // Clear existing content safely
  element.textContent = '';

  if (content instanceof Node) {
    element.appendChild(content);
  } else {
    console.error('setTab: content must be a DOM Node for security. HTML strings are not supported.');
  }
}

/**
 * Create a button element
 * @param {string} text - Button text (will be escaped)
 * @param {string} dataAction - Data attribute value for event delegation
 * @param {Object} options - Button options
 * @returns {HTMLButtonElement} Button DOM element
 *
 * SECURITY: Returns a DOM element with safe textContent. Use data-action for event delegation.
 */
export function createButton(text, dataAction, options = {}) {
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

  // Create button using DOM methods (XSS safe)
  const button = document.createElement('button');
  button.textContent = text; // Safe: uses textContent instead of innerHTML
  button.style.cssText = buttonStyle;
  button.className = className;

  // Set data-action attribute for event delegation
  if (dataAction) {
    button.setAttribute('data-action', dataAction);
  }

  return button;
}

/**
 * Create a form field
 * @param {string} label - Field label (will be escaped)
 * @param {string} id - Input ID (will be escaped)
 * @param {Object} options - Field options
 * @returns {HTMLDivElement} Form field DOM element
 */
export function createFormField(label, id, options = {}) {
  const {
    type = 'text',
    placeholder = '',
    required = false,
    value = ''
  } = options;

  // Create container div
  const container = document.createElement('div');
  container.style.marginBottom = '15px';

  // Create label element
  const labelElement = document.createElement('label');
  labelElement.setAttribute('for', id);
  labelElement.style.cssText = 'display: block; margin-bottom: 5px; font-weight: 500;';
  labelElement.textContent = label; // Safe: uses textContent

  // Add required indicator if needed
  if (required) {
    const requiredSpan = document.createElement('span');
    requiredSpan.style.color = 'red';
    requiredSpan.textContent = ' *';
    labelElement.appendChild(requiredSpan);
  }

  // Create input element
  const input = document.createElement('input');
  input.type = type;
  input.id = id;
  input.placeholder = placeholder; // Safe: DOM property, not innerHTML
  input.value = value; // Safe: DOM property, not innerHTML
  if (required) {
    input.required = true;
  }
  input.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;';

  // Assemble the form field
  container.appendChild(labelElement);
  container.appendChild(input);

  return container;
}

export default {
  appendTab,
  appendTabPlus,
  clearTab,
  setTab,
  createButton,
  createFormField
};
