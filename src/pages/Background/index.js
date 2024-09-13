chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
  
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
/*     if (isPageAvailable) {
      await chrome.sidePanel.setOptions({
        tabId,
        enabled: true
      });
    } else {
      // Disables the side panel on all other sites
      await chrome.sidePanel.setOptions({
        tabId,
        enabled: false
      });
    } */
  });
  