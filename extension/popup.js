/**
 * Popup script for Facebook Ads Manager Plugin
 */

document.addEventListener('DOMContentLoaded', async function() {
  // Close popup when ESC is pressed
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      window.close();
    }
  });

  // Check if we're on a Facebook page and update UI accordingly
  // Using Promises (Manifest V3 preferred pattern) instead of callbacks
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tabs[0] || !tabs[0].url) {
      return;
    }

    const currentTab = tabs[0];
    const url = currentTab.url;
    const isOnFacebook = url.includes('facebook.com') || url.includes('business.facebook.com');
    const isOnAdsManager = url.includes('adsmanager') || url.includes('/ads/manager');

    const statusLabel = document.querySelector('.status-label');
    const infoBox = document.querySelector('.info-box p');
    const openBtn = document.getElementById('openFacebook');

    if (!openBtn) {
      return;
    }

    // Remove any existing event listeners by cloning and replacing the button
    const newBtn = openBtn.cloneNode(true);
    openBtn.parentNode.replaceChild(newBtn, openBtn);

    if (isOnAdsManager) {
      // User is already on Ads Manager
      if (statusLabel) {
        statusLabel.textContent = '插件已啟用';
      }
      if (infoBox) {
        infoBox.textContent = '插件已在此頁面上載入。使用快捷鍵 Ctrl+Shift+F 開啟主介面。';
      }

      newBtn.textContent = '重新載入頁面';
      newBtn.addEventListener('click', async function() {
        await chrome.tabs.reload(currentTab.id);
        window.close();
      });

    } else if (isOnFacebook) {
      // User is on Facebook but not Ads Manager
      if (statusLabel) {
        statusLabel.textContent = '準備就緒';
      }
      if (infoBox) {
        infoBox.textContent = '請前往廣告管理員頁面以啟用插件功能。';
      }

      newBtn.textContent = '前往廣告管理員';
      newBtn.addEventListener('click', async function() {
        await chrome.tabs.create({
          url: 'https://business.facebook.com/adsmanager'
        });
      });

    } else {
      // User is not on Facebook
      if (statusLabel) {
        statusLabel.textContent = '等待中';
      }

      newBtn.textContent = '開啟 Facebook 廣告管理員';
      newBtn.addEventListener('click', async function() {
        await chrome.tabs.create({
          url: 'https://business.facebook.com/adsmanager'
        });
      });
    }

  } catch (error) {
    console.error('[FBACC Plugin Popup] Error querying tabs:', error);
  }
});
