# 瀏覽器擴充安裝指南
# Browser Extension Installation Guide

## 🚀 快速開始

### 步驟 1: 建置擴充功能
```bash
# 安裝依賴（如果尚未安裝）
npm install

# 建置瀏覽器擴充
npm run build:extension
```

這會：
1. 編譯所有原始碼
2. 產生最小化的 `fbacc-plugin.min.js`
3. 將檔案複製到 `extension/` 目錄

### 步驟 2: 在瀏覽器中載入擴充功能

#### Chrome / Edge / Brave

1. 開啟瀏覽器，進入擴充功能頁面：
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`

2. 啟用 **開發者模式** (Developer Mode)
   - 通常在右上角有一個切換開關

3. 點擊 **載入未封裝項目** (Load unpacked)

4. 選擇專案中的 `extension` 資料夾

5. 完成！擴充功能現在已安裝

#### Firefox

1. 開啟 Firefox，進入：`about:debugging#/runtime/this-firefox`

2. 點擊 **載入暫時附加元件** (Load Temporary Add-on)

3. 導航到 `extension` 資料夾並選擇 `manifest.json`

4. 完成！擴充功能現在已安裝

**注意**: Firefox 的暫時附加元件在瀏覽器重新啟動後會被移除，需要重新載入。

## 📖 如何使用

### 方法 1: 透過擴充圖示
1. 點擊瀏覽器工具列中的擴充功能圖示（紫色漸層的 "FB" 圖示）
2. 點擊 **開啟 Facebook 廣告管理員** 按鈕
3. 插件會在 Facebook 頁面上自動啟動

### 方法 2: 直接前往 Facebook
1. 直接前往以下任一 Facebook 頁面：
   - https://business.facebook.com/adsmanager
   - https://www.facebook.com/
   - 任何 Facebook 或 Business Manager 頁面
2. 插件會自動載入並注入功能

### 方法 3: 使用快捷鍵
在任何 Facebook 頁面上：
- 按 `Ctrl + Shift + F` (Windows/Linux) 或 `Cmd + Shift + F` (Mac) 開啟/關閉插件介面
- 按 `ESC` 關閉彈出視窗

## ✨ 功能特色

插件載入後，你可以：
- ✅ 管理廣告帳戶（創建、刪除、申訴）
- ✅ 管理粉絲專頁（申訴、刪除、取消隱藏）
- ✅ 管理商業管理平台
- ✅ 新增和管理付款方式
- ✅ 更新帳戶設定（貨幣、時區）

## 🔧 開發模式

### 監視模式（自動重新建置）
```bash
npm run watch
```

檔案變更時會自動重新編譯。**注意**: 你仍需要手動重新載入瀏覽器中的擴充功能。

### 在 Chrome/Edge 中重新載入擴充功能
1. 前往 `chrome://extensions/` 或 `edge://extensions/`
2. 找到 "Facebook Ads Manager Plugin"
3. 點擊重新載入圖示（圓形箭頭）

### 在 Firefox 中重新載入
1. 前往 `about:debugging#/runtime/this-firefox`
2. 找到擴充功能並點擊 **重新載入**

## 🐛 疑難排解

### 問題: 擴充功能無法載入
**解決方案**:
1. 確保你已執行 `npm run build:extension`
2. 檢查 `extension/` 資料夾是否包含 `fbacc-plugin.min.js`
3. 檢查瀏覽器控制台是否有錯誤訊息

### 問題: 插件在 Facebook 上沒有顯示
**解決方案**:
1. 確保你在正確的 Facebook 網域上 (facebook.com 或 business.facebook.com)
2. 重新整理頁面 (F5)
3. 檢查瀏覽器控制台 (F12) 是否有錯誤
4. 嘗試使用快捷鍵 `Ctrl + Shift + F` 觸發插件

### 問題: 變更後沒有生效
**解決方案**:
1. 重新建置: `npm run build:extension`
2. 在瀏覽器的擴充功能頁面重新載入擴充功能
3. 重新整理 Facebook 頁面

### 問題: 圖示未顯示
**解決方案**:
- 圖示已自動產生為 SVG 格式
- 如果瀏覽器不支援 SVG 圖示，請參考 `extension/icons/ICONS.md` 創建 PNG 圖示

## 📦 建置命令參考

```bash
# 標準建置（開發版）
npm run build

# 開發建置（含 source maps）
npm run build:dev

# 正式版建置（最小化）
npm run build:prod

# 建置並複製到 extension 資料夾
npm run build:extension

# 監視模式（自動重新建置）
npm run watch

# 清理建置檔案
npm run clean

# 清理所有（包括 extension 中的檔案）
npm run clean:all

# 程式碼檢查
npm run lint

# 程式碼格式化
npm run format
```

## 📁 擴充功能檔案結構

```
extension/
├── manifest.json          # 擴充功能設定檔
├── popup.html            # 彈出視窗 UI
├── popup.js              # 彈出視窗邏輯
├── fbacc-plugin.min.js   # 編譯後的插件（建置後產生）
├── fbacc-plugin.min.js.map  # Source map（建置後產生）
└── icons/                # 擴充功能圖示
    ├── icon16.svg
    ├── icon32.svg
    ├── icon48.svg
    ├── icon128.svg
    └── ICONS.md          # 圖示指南
```

## 🔒 權限說明

此擴充功能需要以下權限：

- **activeTab**: 存取目前標籤頁以注入插件
- **scripting**: 在頁面中執行內容腳本
- **host_permissions** (`*://*.facebook.com/*`, `*://*.business.facebook.com/*`):
  - 僅在 Facebook 網域上運作
  - 需要存取 Facebook API 和頁面內容

## 📝 版本資訊

**目前版本**: 6.4.0

### Manifest 版本
- 使用 **Manifest V3**（Chrome/Edge/Brave 的最新標準）
- 與 Firefox 相容

## 🆘 需要幫助？

如有問題或需要協助：

1. 檢查瀏覽器控制台 (F12) 的錯誤訊息
2. 確保你使用的是最新版本的瀏覽器
3. 查看 GitHub Issues 或創建新的 issue
4. 參考主要的 README.md 了解 API 文件

## ⚠️ 重要注意事項

- 此擴充功能會處理敏感的 Facebook 資料和存取權杖
- 僅在你信任的環境中使用
- 遵守 Facebook 的平台政策和服務條款
- 不要分享你的存取權杖或帳戶憑證

## 🎉 享受使用！

現在你已經準備好使用 Facebook Ads Manager Plugin 瀏覽器擴充功能了！
