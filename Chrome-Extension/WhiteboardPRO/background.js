let installed = 1;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ installed });
  chrome.storage.sync.set({ color:'#333333' });
});
