# Facebook Ads Manager Plugin

A modular, well-structured plugin for managing Facebook Ads Manager operations including ad accounts, pages, business managers, and payment methods.

## Version

**6.4.0**

## Features

### Core Functionality
- ✅ **Authentication & Token Management** - Automatic Facebook access token extraction
- ✅ **Ad Account Management** - Create, delete, appeal, and manage ad accounts
- ✅ **Credit Card Management** - Add and manage payment methods
- ✅ **Fanpage Management** - Appeal, delete, and unhide Facebook pages
- ✅ **Business Manager** - Manage Business Manager accounts and permissions
- ✅ **Settings** - Update currency and timezone settings

### UI Components
- Modern popup interface
- Tab-based content organization
- Responsive forms and buttons
- Keyboard shortcuts (ESC to close, Ctrl+Shift+F to toggle)

## Project Structure

```
fbacc/
├── src/
│   ├── core/                 # Core functionality
│   │   ├── config.js        # Configuration and constants
│   │   ├── auth.js          # Authentication and token management
│   │   └── api.js           # API request handling
│   ├── modules/             # Feature modules
│   │   ├── adAccount.js     # Ad account operations
│   │   ├── creditCard.js    # Payment method management
│   │   ├── fanpage.js       # Page management
│   │   ├── businessManager.js # Business Manager operations
│   │   └── settings.js      # Account settings
│   ├── ui/                  # UI components
│   │   ├── popup.js         # Popup window management
│   │   └── tabs.js          # Tab components
│   ├── utils/               # Utility functions
│   │   ├── helpers.js       # General helper functions
│   │   ├── http.js          # HTTP request utilities
│   │   └── dom.js           # DOM manipulation utilities
│   └── main.js              # Main entry point
├── extension/               # Browser extension files
│   ├── manifest.json        # Extension manifest (Manifest V3)
│   ├── popup.html          # Extension popup interface
│   ├── popup.js            # Popup logic
│   ├── icons/              # Extension icons
│   └── *.min.js            # Built plugin (copied during build)
├── dist/                    # Built/bundled files (generated)
├── scripts/                 # Build and utility scripts
├── package.json
├── rollup.config.js         # Build configuration
├── README.md
└── EXTENSION_INSTALL.md     # Extension installation guide
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd fbacc
```

2. Install dependencies:
```bash
npm install
```

## Development

### Build Commands

```bash
# Development build with source maps
npm run build:dev

# Production build (minified)
npm run build:prod

# Build for browser extension (recommended)
npm run build:extension

# Watch mode (auto-rebuild on changes)
npm run watch

# Clean build directory
npm run clean

# Clean all (including extension files)
npm run clean:all
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

## Build Output

The build process generates:
- `dist/fbacc-plugin.js` - Development build with source maps
- `dist/fbacc-plugin.min.js` - Production build (minified)

## Usage

### As a Browser Extension (Recommended)

**完整的瀏覽器擴充功能現已可用！**

1. Build the extension:
```bash
npm run build:extension
```

2. Load in your browser:
   - **Chrome/Edge/Brave**: Go to `chrome://extensions/`, enable Developer Mode, click "Load unpacked", select the `extension` folder
   - **Firefox**: Go to `about:debugging`, click "Load Temporary Add-on", select `extension/manifest.json`

**📖 詳細安裝指南**: 請參考 [EXTENSION_INSTALL.md](EXTENSION_INSTALL.md)

This provides a complete browser extension with:
- ✅ Popup interface for easy access
- ✅ Automatic script injection on Facebook pages
- ✅ Keyboard shortcuts (Ctrl+Shift+F)
- ✅ Proper permissions and security
- ✅ Beautiful gradient icons

### As a Userscript

1. Build the plugin
2. Copy the contents of `dist/fbacc-plugin.min.js`
3. Create a new userscript in your userscript manager (Tampermonkey, Greasemonkey, etc.)
4. Paste the code

### Programmatic Usage

```javascript
import { PluginState } from './src/main.js';
import * as AdAccount from './src/modules/adAccount.js';
import * as Auth from './src/core/auth.js';

// Get access token
const tokenInfo = Auth.getAccessToken();

// Appeal an ad account
const result = await AdAccount.appealAdAccount('123456789', tokenInfo.token);
```

## API Documentation

### Core Modules

#### Authentication (`src/core/auth.js`)
- `getAccessToken()` - Extract Facebook access token
- `checkAuth()` - Check authentication status
- `validateToken(token)` - Validate token format

#### API (`src/core/api.js`)
- `graphAPIRequest(endpoint, options)` - Make Graph API requests
- `graphQLRequest(docId, variables, friendlyName)` - Make GraphQL requests
- `batchGraphAPIRequests(requests)` - Batch multiple requests

### Feature Modules

#### Ad Account (`src/modules/adAccount.js`)
- `appealAdAccount(accountId, accessToken)` - Appeal ad account
- `deleteAdAccount(adAccountId, accessToken)` - Delete ad account
- `getAdAccountDetails(accountId, accessToken)` - Get account details

#### Credit Card (`src/modules/creditCard.js`)
- `addCreditCardToAccount(...)` - Add payment method
- `showAddCreditCardForm()` - Show add card form

#### Fanpage (`src/modules/fanpage.js`)
- `appealFanpage(pageId, accessToken)` - Appeal page
- `deleteFanpage(pageId, accessToken)` - Delete page
- `unhideFanpage(pageId, accessToken)` - Unhide page

#### Business Manager (`src/modules/businessManager.js`)
- `addBusinessManager(bmName, accessToken)` - Create BM
- `addUserToBusinessManager(...)` - Add user to BM
- `addAdAccountToBusinessManager(...)` - Add ad account to BM

#### Settings (`src/modules/settings.js`)
- `updateAccountCurrency(accountId, currency, accessToken)` - Update currency
- `updateAccountTimezone(accountId, timezone, accessToken)` - Update timezone

## Configuration

Edit `src/core/config.js` to modify:
- Plugin version
- Valid activation paths
- Currency symbols
- Other constants

## Keyboard Shortcuts

- `ESC` - Close popup
- `Ctrl/Cmd + Shift + F` - Toggle popup visibility

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Security Notes

⚠️ This plugin handles sensitive data including:
- Facebook access tokens
- Payment information
- Account credentials

**Important:**
- Never commit access tokens to version control
- Use HTTPS for all API requests
- Validate all user inputs
- Follow Facebook's Platform Policies

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Code Style

- Use ES6+ modules
- Follow JSDoc conventions for documentation
- Use meaningful variable and function names
- Keep functions small and focused
- Write self-documenting code

## License

MIT License - See LICENSE file for details

## Changelog

### Version 6.4.0
- Initial modular restructure
- Separated code into logical modules
- Added build system with Rollup
- Improved documentation
- Added development tools (ESLint, Prettier)

## Support

For issues and questions:
- Open an issue on GitHub
- Contact: [your-email@example.com]

## Disclaimer

This plugin is for educational and development purposes. Users are responsible for complying with Facebook's Terms of Service and Platform Policies when using this plugin.
