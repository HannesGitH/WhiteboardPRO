function sniffPoints(){
    var listed_assignments = 0;
    var graded_assignments = 0;
    var got_accu = 0;
    var total_accu = 0;
    while(true){
      let xth_grade = document.querySelector(`#_id_${listed_assignments}__hide_division_ > td:nth-child(3)`)
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

function runInjection() {

    let headl = document.querySelector("#gbForm > table:nth-child(1) > tbody > tr > td.bogus > h2");
    headl.insertAdjacentHTML('afterend',
        `
        <label>needed %</label><br>
        <input name="needed %" type="number" maxlength="2" value="60" id="needed_percent" class="input"/></br><br>
        <label>additional Assignments</label><br>
        <input name="additional Assignments" type="number" maxlength="2" id="additional_ass" class="input"/><br>
        <label>or missing points</label><br>
        <input name="additional Assignments" type="number" maxlength="2" id="additional_pts" class="input"/><br>
        <label id="sniffer_calculate">Calculate Points</label>
        <p id="output"></p>`
    );
    let output = document.getElementById("output");

    let needed_percent = document.getElementById("needed_percent");
    let additional_ass = document.getElementById("additional_ass");
    let additional_pts = document.getElementById("additional_pts");

    let calculate = document.getElementById("sniffer_calculate");
    calculate.addEventListener("click", async () => {

        let result = sniffPoints();

            function totalPoints(){
                if (additional_pts.value != null && additional_pts.value != "") {
                additional_ass.value="";
                return result.total+Number(additional_pts.value);
                }
                return Math.ceil(result.total + (result.total/result.graded_assignments)*(Number(result.listed_assignments-result.graded_assignments)+Number(additional_ass.value)))
            }

        let total = totalPoints();
        let got   = Number(result.got)
        let needed= Math.ceil(total*Number(needed_percent.value)/100)
        output.innerHTML = needed > got ? `<h3>you need to get ${needed-got} more points to pass this course</h3>` : `<h3>aw snap you did more than needed. \n To be exact ${got-needed} points</h3>` 
    })
}

window.addEventListener('load', function () {
    //check if this is the gradebook
    let grade = document.querySelector("#gbForm\\:_idJsp29\\:_idJsp56");
    if(!grade)return -1;
    return runInjection();
})