/**
 * Utility Helper Functions
 * Common helper functions used throughout the application
 */

/**
 * Get cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|undefined} Cookie value or undefined if not found
 */
export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return undefined;
}

/**
 * Get URL parameter value
 * @param {string} name - Parameter name
 * @returns {string|null} Parameter value or null if not found
 */
export function getURLParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

/**
 * Copy text to clipboard using modern Clipboard API with fallback
 * @param {string} text - Text to copy
 * @returns {Promise<void>}
 */
export async function copyToClipboard(text) {
  // Try modern Clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (err) {
      console.warn('Clipboard API failed, falling back to execCommand:', err);
    }
  }

  // Fallback to deprecated execCommand for older browsers
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.top = '0';
    textarea.style.left = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);

    if (!successful) {
      throw new Error('execCommand copy failed');
    }
  } catch (err) {
    console.error('Failed to copy text to clipboard:', err);
    throw new Error('Could not copy to clipboard');
  }
}

/**
 * Shadow text for display (partially hide sensitive information)
 * @param {string} text - Text to shadow
 * @param {number} visibleChars - Number of characters to keep visible
 * @returns {string} Shadowed text
 */
export function shadowText(text, visibleChars = 4) {
  if (!text || text.length <= visibleChars) return text;
  const visible = text.substring(0, visibleChars);
  const hidden = '*'.repeat(text.length - visibleChars);
  return visible + hidden;
}

export default {
  getCookie,
  getURLParameter,
  copyToClipboard,
  shadowText
};
