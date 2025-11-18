/**
 * Popup script for Facebook Ads Manager Plugin
 */

document.addEventListener('DOMContentLoaded', function() {
  const openFacebookBtn = document.getElementById('openFacebook');

  if (openFacebookBtn) {
    openFacebookBtn.addEventListener('click', function() {
      chrome.tabs.create({
        url: 'https://business.facebook.com/adsmanager'
      });
    });
  }

  // Close popup when ESC is pressed
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      window.close();
    }
  });

  // Check if we're on a Facebook page and update UI accordingly
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs[0] && tabs[0].url) {
      const url = tabs[0].url;
      const isOnFacebook = url.includes('facebook.com') || url.includes('business.facebook.com');
      const isOnAdsManager = url.includes('adsmanager') || url.includes('/ads/manager');

      const statusLabel = document.querySelector('.status-label');
      const infoBox = document.querySelector('.info-box p');
      const openBtn = document.getElementById('openFacebook');

      if (isOnAdsManager) {
        // User is already on Ads Manager
        if (statusLabel) {
          statusLabel.textContent = '插件已啟用';
        }
        if (infoBox) {
          infoBox.textContent = '插件已在此頁面上載入。使用快捷鍵 Ctrl+Shift+F 開啟主介面。';
        }
        if (openBtn) {
          openBtn.textContent = '重新載入頁面';
          openBtn.onclick = function() {
            chrome.tabs.reload(tabs[0].id);
            window.close();
          };
        }
      } else if (isOnFacebook) {
        // User is on Facebook but not Ads Manager
        if (statusLabel) {
          statusLabel.textContent = '準備就緒';
        }
        if (infoBox) {
          infoBox.textContent = '請前往廣告管理員頁面以啟用插件功能。';
        }
        if (openBtn) {
          openBtn.textContent = '前往廣告管理員';
        }
      } else {
        // User is not on Facebook
        if (statusLabel) {
          statusLabel.textContent = '等待中';
        }
      }
    }
  });
});
