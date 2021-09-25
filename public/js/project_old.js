$(() => {

  // $.getScript("js/utils.js");
  // $.getScript("js/chart_manager.js");

  $.ajax({
    async: false,
    url: "../js/chart.js/Chart.js",
    dataType: "script"
  });
  $.ajax({
    async: false,
    url: "../js/api.js",
    dataType: "script"
  });
  $.ajax({
    async: false,
    url: "../js/utils.js",
    dataType: "script"
  });

  var ctxProjChart = document.getElementById('projChart').getContext('2d');
  var ctxProjMembersChart = document.getElementById("myPieChart").getContext("2d");  

  var gTodos = [];
  const TODO_STATUS = ["active", "ongoing", "canceled"];

  var gTasks = [
      {
        id: 1,
        "name": "Infiltrate the Mansion",
	"description": "From our intelligent source we've found that Mr. X has been in the B123 Mansion in Chimera District. We need to infiltrate and get as much information as possible",
	"status": "ongoing",
	"project_id": 1,
	"start_date": "2021-06-10",
	"end_date": "2021-07-20",
	"progress": 34,
	"efforts_needed": 300,
        "efforts_put": 100, 
      },
      {
        id: 2,
        "name": "Kill the Mansion",
	"description": "From our intelligent source we've found that Mr. X has been in the B123 Mansion in Chimera District. We need to infiltrate and get as much information as possible",
	"status": "ongoing",
	"project_id": 1,
	"start_date": "2021-06-10",
	"end_date": "2021-07-20",
	"progress": 79,
	"efforts_needed": 300,
        "efforts_put": 100, 
      }      
  ];

  initDocument();

  async function initDocument(){
    // this project come from project.ejs
    // FIXME: get project through api 
    loadProjectDashboard(project.proj);
  }

  function loadProjectTable(data) {
    if(!data) return false;
    data.forEach((proj) => {
      addProjectToTable(proj);
    });
    return false;
  }

  function addProjectToTable(proj){
    var sDate = sqlDateStrToReadDate(proj.start_date);
    var eDate = sqlDateStrToReadDate(proj.end_date);
    $('#tBody').append($('<tr>').attr("id",  proj.id).append(
      $('<td>').text(proj.name)).append(
	$('<td>').text(proj.description)).append(
          $('<td>').text(proj.project_manager)).append(
            $('<td>').text(sDate)).append(
              $('<td>').text(eDate)).append(
		$('<td>').text(proj.progress)).append(
                  $('<td>').text(proj.efforts_put)).append(
                    $('<td>').text("??")).append(
                      $('<td>').text("??")).append(                      
			$('<td>').append(
			  $('<div>').text("Delete").addClass("btn btn-danger").on("click", null, proj.id, deleteProjectCallback))
		      ));
  }

  function deleteProjectCallback(e){
    deleteProject(e.data).then((res) => {
      if(res){
	$('#' + e.data).remove();
	console.log("removed tr from table");
      } else {
	console.log("not removed tr from table");        
      }
    });
  }

  async function loadProjectDashboard(proj){
    var budget = proj.budget;
    var endDate = sqlDateStrToReadDate(proj.end_date);
    var tasksCount = "??";
    var progress = proj.progress;
    var pending = "??";

    loadHeadlines(budget, endDate, progress, pending);

    var tasks = await getProjectTasks(proj.id);

    for(var i = 0; i < tasks.length; i++){
      var newTodos = await getTaskTodos(tasks[i].id);
      gTodos = gTodos.concat(newTodos);
    }

    loadTasks(tasks);
    loadTodos(gTodos);
    loadWorkHourChart();

    // getting member details 
    var relProjMem = await getAllProjectMembers(proj.id);
    var members = []; 
    for(var i = 0; i < relProjMem.length; i++){
      var mem = await getMember(relProjMem[i].member_id);
      members.push(mem);
    }

    var remainEfforts = proj.efforts_needed - proj.efforts_put;
    loadProjectMembersChart(members, remainEfforts);    
  }


  function loadHeadlines(budget, deadline, progress, pending){
    $('#projectBudget').text(budget);    
    $('#projectDeadline').text(deadline);
    $('#projectProgress').text(`${progress}%`);
    $('#projectProgressBar').text(`${progress}%`).css('width', progress);    
    $('#projectPending').text(pending);
  }

  function loadTasks(tasks){
    tasks.forEach((task) => {
      var progressColor = "bg-success";
      var progress = task.progress;
      if(progress < 20){
        progressColor = "bg-danger";
      } else if(progress < 40){
        progressColor = "bg-warning";
      } else if(progress < 60){
        progressColor = "bg-primary";
      } else if(progress < 80){
        progressColor = "bg-info";
      }

      $('#taskList').append(`<h4 class="small font-weight-bold" id="${task.id}">${task.name}
      <span class="float-right">${progress}%</span></h4>
      <div class="progress mb-4">
      <div class="progress-bar ${progressColor}" role="progressbar" style="width: ${progress}%"
    aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
      </div>`);
    });
  }

  function loadTodos(todos){
    $('#todoList').text("");
    var selTab = $('.todo-nav .active').text();

    var checkStatus = "all";
    if(selTab == "Active") {
      checkStatus = "active";
    } else if (selTab == "Completed"){
      checkStatus = "complete";
    }

    todos.forEach((todo) => {
      console.log(todo);
      if(checkStatus != TODO_STATUS[todo.status] && checkStatus != "all") return;
      $('#todoList').append(`
            <div class="todo-item" id="${todo.id}">
              <div class="checker">
                <input class="mx-2" type="checkbox" id="${todo.id}" ${todo.status == "complete" ? "checked" : ""} disabled>
                  <span class="small font-weight-bold">${todo.name}<span/>
              </div>
            </div>`);
    });
  }


  $('.todo-tab').click((e) => {
    e.preventDefault();
    $('.todo-nav .active').removeClass("active");
    $(e.currentTarget).addClass("active");
  });
    loadTodos(gTodos);

  function loadWorkHourChart(){
    var d = new Date(Date.now());
    var y = d.getFullYear();
    var m = d.getMonth();
    var dm = getDaysInMonth(y, m);

    var labels = Array.from({length: dm}, (_,i) => i+1);
    var data = generateRandomData(dm, 0, 24);
    var randomColors = generateRandomColors(dm);
    var myChart = new Chart(ctxProjChart, {
      type: 'line',
      data: {
	labels: labels,
	datasets: [{
          label: 'Work Hours',
          data: data,
          backgroundColor: randomColors, 
          borderColor: randomColors,
          borderWidth: 2,
	  fill: true, 
	}]
      },
      options: {
	scales: {
          y: {
            beginAtZero: true
          }
	}
      }
    });
  }

  function loadProjectMembersChart(projMembers, remainEfforts){
    var labels = Array.from(projMembers, (e, i) => e.username);
    labels.push("Remain Hours");
    var data = Array.from(projMembers, (e, i) => e.efforts_put);
    data.push(remainEfforts);
    var colors = generateRandomColors(data.length);

    var config = {
      type: 'pie',
      data: {
	labels: labels, 
	datasets: [{
	  label: "HellO label ?? ",
	  data: data, 
	  backgroundColor: colors,
	  borderColor: colors,
	  borderWidth: 0.5, 
	}]
      }, 
      options: {
	plugins: {
	  legend: true,
	  tooltip: false, 
	},
	elements: {
	  arc: {
            // backgroundColor: "#FFFF00"
            // hoverBackgroundColor: hoverColorize
	  }
	}
      }
    };

    var pieChart = new Chart(ctxProjMembersChart, config);
  }
  

});
