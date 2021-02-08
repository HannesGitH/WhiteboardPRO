
var toggle = document.getElementById("DMtoggle");

chrome.storage.sync.get("forceDM", ({ forceDM }) => {
  console.log(forceDM);
  toggle.checked = forceDM;
});

toggle.addEventListener("click", () => {
  toggle.style.color = 'red'
  chrome.storage.sync.set({ forceDM:toggle.checked});
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
  });
});