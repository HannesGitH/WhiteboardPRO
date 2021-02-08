
let headline = document.getElementById("headline");
let output = document.getElementById("output");
let calculate = document.getElementById("calculate");

let needed_percent = document.getElementById("needed_percent");
let additional_ass = document.getElementById("additional_ass");
let additional_pts = document.getElementById("additional_pts");

chrome.storage.sync.get("color", ({ color }) => {
  calculate.style.backgroundColor = color;
});

calculate.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getPoints,
  },
  (injectionResults) => {
    var result = -1;
    for (const frameResult of injectionResults){
      if (frameResult.result != -1) result = frameResult.result;
    }
    if (result == -1){
      output.innerHTML = "pls open your gradebook";
    }else{

      function totalPoints() {
        if (additional_pts.value != null && additional_pts.value != "") {
          additional_ass.value="";
          return result.total+Number(additional_pts.value);
        }
        return Math.ceil(result.total + (result.total/result.graded_assignments)*(Number(result.listed_assignments-result.graded_assignments)+Number(additional_ass.value)))
      }

      let total = totalPoints();
      let got   = Number(result.got)
      let needed= Math.ceil(total*Number(needed_percent.value)/100)
      output.innerHTML= needed > got ? `you need to get ${needed-got} more points to pass this course` : `aw snap you did more than needed. \n To be exact ${got-needed} points`  
    }
  });
});

//this runs on the kvv-document and returns the points
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
    if(!grade)return -1;
    //grade.innerHTML="friggn Grade yo";
    return sniffPoints();
}