// Initialize button with users's prefered color
//let changeColor = document.getElementById("changeColor");
let headline = document.getElementById("headline");
let calculate = document.getElementById("calculate");

chrome.storage.sync.get("color", ({ color }) => {
  calculate.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
calculate.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });
});

// The body of this function will be execuetd as a content script inside the
// current page
function setPageBackgroundColor() {
    let grade = document.querySelector("#gbForm\\:_idJsp29\\:_idJsp56");
    if(grade){headline.innerHTML="Well Done"}
    grade.innerHTML="lololol"
    document.body.style.backgroundColor = color;
}
