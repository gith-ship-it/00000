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

  // Check if we're on a Facebook page
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs[0] && tabs[0].url) {
      const url = tabs[0].url;
      if (url.includes('facebook.com') || url.includes('business.facebook.com')) {
        // Update status or show different UI
        console.log('Already on Facebook');
      }
    }
  });
});
