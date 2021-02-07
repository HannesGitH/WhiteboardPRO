// Initialize button with users's prefered color
//let changeColor = document.getElementById("changeColor");
let headline = document.getElementById("headline");
let output = document.getElementById("output");
let calculate = document.getElementById("calculate");

let needed_percent = document.getElementById("needed_percent");
let additional_ass = document.getElementById("additional_ass");
let additional_pts = document.getElementById("additional_pts");

chrome.storage.sync.get("color", ({ color }) => {
  calculate.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
calculate.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getPoints,
  },
  (injectionResults) => {
    var result;
    for (const frameResult of injectionResults)
      result = frameResult.result
    let total = Math.ceil(result.total + (result.total/result.graded_assignments)*(Number(result.listed_assignments-result.graded_assignments)+Number(additional_ass.value)))
    let got   = Number(result.got)
    let needed= Math.ceil(total*Number(needed_percent.value)/100)
    output.innerHTML= needed > got ? `you need to get ${needed-got} more points to pass this course` : `aw snap you did more than needed. \n To be exact ${got-needed} points`
  });
});

// The body of this function will be execuetd as a content script inside the
// current page
function getPoints() {

  function sniffPoints(){
    var listed_assignments = 0;
    var graded_assignments = 0;
    var got_accu = 0;
    var total_accu = 0;
    while(true){
      let xth_grade = document.querySelector(`#_id_${listed_assignments}__hide_division_ > td:nth-child(3)`);
      if (!xth_grade)break;
      let [got, total] = xth_grade.innerHTML.split("/");
      if (!isNaN(got)){
        got_accu += Number(got); 
        total_accu += Number(total);
        graded_assignments++;
      }
      listed_assignments++;
    }
    return{got:got_accu, total:total_accu,listed_assignments,graded_assignments};
  }

  let grade = document.querySelector("#gbForm\\:_idJsp29\\:_idJsp56");
    if(!grade)return "pls open your gradebook";
    grade.innerHTML="friggn Grade yo";
    return sniffPoints();
}