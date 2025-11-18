/**
 * Configuration and Constants
 * Global configuration for Facebook Ads Manager Plugin
 */

export const CONFIG = {
  VERSION: '6.4',

  // Facebook Graph API version
  FB_API_VERSION: 'v19.0',

  // Valid paths for the plugin to activate
  VALID_PATHS: [
    '/adsmanager/manage/campaigns',
    '/ads/creativehub/home/',
    '/adsmanager/manage/all',
    '/adsmanager/manage/ads',
    '/adsmanager/manage/adsets'
  ],

  // Facebook GraphQL Document IDs
  // Note: These may change when Facebook updates their API
  GRAPHQL_DOC_IDS: {
    // Ad Account Operations
    AD_ACCOUNT_APPEAL: '5197966936890203',
    AD_ACCOUNT_DELETE: '4787981637941330',

    // Fanpage Operations
    PAGE_APPEAL: '5197966936890203',
    PAGE_DELETE: '4899485650107392',
    PAGE_UNHIDE: '4920939114687785',

    // Business Manager Operations
    BM_CREATE: '4787981637941333',
    BM_ADD_USER: '4787981637941334',
    BM_ADD_AD_ACCOUNT: '4787981637941335',
    BM_REQUEST_AD_ACCOUNT: '4787981637941336',

    // Credit Card Operations
    ADD_CREDIT_CARD: '4896364773778784'
  },

  // Cookie names
  COOKIES: {
    USER_ID: 'i_user'
  },

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
