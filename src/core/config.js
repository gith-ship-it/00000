/**
 * Configuration and Constants
 * Global configuration for Facebook Ads Manager Plugin
 */

export const CONFIG = {
  VERSION: '6.4',

  // Valid paths for the plugin to activate
  VALID_PATHS: [
    '/adsmanager/manage/campaigns',
    '/ads/creativehub/home/',
    '/adsmanager/manage/all',
    '/adsmanager/manage/ads',
    '/adsmanager/manage/adsets'
  ],

  // Currency symbols mapping
  CURRENCY_SYMBOLS: {
    'USD': '$',    // US Dollar
    'EUR': '€',    // Euro
    'CRC': '₡',    // Costa Rican Colón
    'GBP': '£',    // British Pound Sterling
    'ILS': '₪',    // Israeli New Sheqel
    'INR': '₹',    // Indian Rupee
    'JPY': '¥',    // Japanese Yen
    'KRW': '₩',    // South Korean Won
    'NGN': '₦',    // Nigerian Naira
    'PHP': '₱',    // Philippine Peso
    'PLN': 'zł',   // Polish Zloty
    'PYG': '₲',    // Paraguayan Guarani
    'THB': '฿',    // Thai Baht
    'UAH': '₴',    // Ukrainian Hryvnia
    'VND': '₫'     // Vietnamese Dong
  }
};

export default CONFIG;
