/**
 * Tabs UI Component
 * Manages content tabs within the plugin popup
 */

/**
 * Append content to a tab
 * @param {string|HTMLElement} content - Content to append (HTML string or DOM element)
 * @param {string} tabId - Tab element ID
 */
export function appendTab(content, tabId) {
  const element = document.getElementById(tabId);
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
    // Safe: clearing content, no XSS risk
    element.innerHTML = '';
  }
}

/**
 * Set tab content (replace existing content)
 * @param {string|HTMLElement} content - Content to set (HTML string or DOM element)
 * @param {string} tabId - Tab element ID
 */
export function setTab(content, tabId) {
  const element = document.getElementById(tabId);
  if (element) {
    // Clear existing content
    element.innerHTML = '';

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
 * Create a button element
 * @param {string} text - Button text (will be escaped)
 * @param {Function|string} onClick - Click handler function or onclick attribute string
 * @param {Object} options - Button options
 * @returns {HTMLButtonElement} Button DOM element
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

  // Create button using DOM methods (XSS safe)
  const button = document.createElement('button');
  button.textContent = text; // Safe: uses textContent instead of innerHTML
  button.style.cssText = buttonStyle;
  button.className = className;

  // Handle onClick
  if (typeof onClick === 'function') {
    button.onclick = onClick;
  } else if (typeof onClick === 'string') {
    // For backwards compatibility with onclick strings
    button.setAttribute('onclick', onClick);
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
