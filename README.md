# Facebook Ads Manager Plugin

A modular, well-structured plugin for managing Facebook Ads Manager operations including ad accounts, pages, business managers, and payment methods. This project is designed for developers and advanced users to automate and streamline Facebook Ads tasks.

## Version

**6.4.0**

## Features

### Core Functionality
- ✅ **Authentication & Token Management** - Automatic extraction of Facebook access tokens from the user's session.
- ✅ **Ad Account Management** - Functions to appeal restrictions, delete accounts, and manage user access.
- ✅ **Credit Card Management** - Add new payment methods directly to ad accounts.
- ✅ **Fanpage Management** - Appeal page restrictions, delete pages, and manage visibility.
- ✅ **Business Manager** - Create Business Managers and manage ad account/user associations.
- ✅ **Settings** - Update ad account currency and timezone settings.

### UI Components
- **Modern Popup Interface**: Clean, tabbed interface for easy interaction.
- **Responsive Forms**: Dynamic forms for adding credit cards and editing settings.
- **Keyboard Shortcuts**: Quick access with `Ctrl+Shift+F` (Toggle) and `ESC` (Close).

## Project Structure

The project follows a modular architecture to separate concerns and improve maintainability:

```
fbacc/
├── src/
│   ├── core/                 # Core infrastructure
│   │   ├── config.js        # Global configuration (API versions, paths, constants)
│   │   ├── auth.js          # Authentication logic (Token extraction, validation)
│   │   └── api.js           # Centralized API handling (Graph API & GraphQL wrappers)
│   ├── modules/             # Feature-specific business logic
│   │   ├── adAccount.js     # Ad Account operations (Appeal, Delete, Get Details)
│   │   ├── creditCard.js    # Payment method operations
│   │   ├── fanpage.js       # Fanpage operations (Appeal, Delete, Unhide)
│   │   ├── businessManager.js # Business Manager creation and management
│   │   └── settings.js      # Account settings (Currency, Timezone)
│   ├── ui/                  # User Interface components
│   │   ├── popup.js         # Popup window lifecycle and layout
│   │   └── tabs.js          # Tab system and UI helpers (Buttons, Forms)
│   ├── utils/               # Shared utility functions
│   │   ├── helpers.js       # General utilities (Cookies, URL params, Clipboard)
│   │   ├── http.js          # Low-level HTTP request wrappers
│   │   └── dom.js           # Safe DOM manipulation helpers
│   └── main.js              # Application entry point and state management
├── extension/               # Browser extension specific files
│   ├── manifest.json        # Chrome Extension Manifest V3
│   ├── popup.html           # Extension popup HTML
│   ├── popup.js             # Extension popup logic
│   ├── loader.js            # Content script loader
│   └── icons/               # Assets
├── dist/                    # Compiled build artifacts
├── scripts/                 # Build automation scripts
├── package.json             # Project dependencies and scripts
├── rollup.config.js         # Rollup bundler configuration
└── README.md                # Project documentation
```

## Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn**

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd fbacc
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Development Workflow

### Build Commands

- **Build for Browser Extension (Recommended):**
  ```bash
  npm run build:extension
  ```
  This compiles the code in production mode and copies necessary files to the `extension/` directory, ready for loading into a browser.

- **Development Build:**
  ```bash
  npm run build:dev
  ```
  Creates a non-minified build with source maps in `dist/`, useful for debugging.

- **Watch Mode:**
  ```bash
  npm run watch
  ```
  Automatically rebuilds the project when source files change.

- **Code Quality:**
  ```bash
  npm run lint    # Run ESLint
  npm run format  # Format code with Prettier
  ```

## Usage Guide

### As a Browser Extension

1. Run `npm run build:extension` to generate the extension files.
2. Open your browser's extension management page:
   - **Chrome/Edge/Brave**: `chrome://extensions/`
   - **Firefox**: `about:debugging`
3. Enable **Developer Mode**.
4. Click **Load unpacked** (or "Load Temporary Add-on" in Firefox).
5. Select the `extension` folder in this project.

**Usage:**
- Navigate to Facebook Ads Manager (`adsmanager/manage/campaigns`).
- Click the extension icon or use `Ctrl+Shift+F` to open the plugin popup.
- Use the tabs to manage accounts, pages, and settings.

### Programmatic Usage

The plugin exposes a global API `window.FBACCPlugin` for advanced usage or integration with other tools.

```javascript
// Example: Accessing the API via browser console
const plugin = window.FBACCPlugin;

// Get current state
console.log(plugin.getState());

// Appeal the current ad account programmatically
const token = plugin.getState().accessToken;
const accountId = plugin.getState().accountId;

plugin.AdAccount.appealAdAccount(accountId, token)
  .then(result => console.log(result));
```

## API Documentation

The codebase is fully documented with JSDoc. Below is a high-level overview of key modules.

### Core Modules (`src/core/`)
- **Auth**: `getAccessToken()`, `checkAuth()`, `validateToken()`
- **API**: `graphAPIRequest()`, `graphQLRequest()` - Handles authentication and error normalization.

### Feature Modules (`src/modules/`)
- **AdAccount**: `appealAdAccount()`, `deleteAdAccount()`, `getAdAccountDetails()`
- **CreditCard**: `addCreditCardToAccount()`, `showAddCreditCardForm()`
- **Fanpage**: `appealFanpage()`, `deleteFanpage()`, `unhideFanpage()`
- **BusinessManager**: `addBusinessManager()`, `addUserToBusinessManager()`
- **Settings**: `updateAccountCurrency()`, `updateAccountTimezone()`

## Contributing

1. **Fork** the repository.
2. Create a **feature branch** (`git checkout -b feature/new-feature`).
3. **Commit** your changes with clear messages.
4. **Push** to your branch and open a **Pull Request**.

Please ensure all code is documented using JSDoc and passes linting (`npm run lint`).

## License

MIT License - See LICENSE file for details.

## Disclaimer

This tool is for educational and development purposes only. Users are responsible for ensuring compliance with Facebook's Terms of Service and Platform Policies. Use at your own risk.
