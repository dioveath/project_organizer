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
    url: "../js/utils.js",
    dataType: "script"
  });

  var ctxProjChart = document.getElementById('projChart').getContext('2d');
  var ctxProjMembersChart = document.getElementById("myPieChart").getContext("2d");  

  initDocument();

  async function initDocument(){
    loadProjectDashboard(data.proj, data.members, data.tasks, data.todos);
  }
  
  async function loadProjectDashboard(proj, members){
    var budget = proj.budget;
    var endDate = sqlDateStrToReadDate(proj.end_date);
    var progress = proj.progress;
    var pending = "??";

    loadHeadlines(budget, endDate, progress, pending);
    loadWorkHourChart();

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

  var memberApiUrl = "http://localhost:1234/api/v1/member";
  var projectApiUrl = "http://localhost:1234/api/v1/project";


  class ProjectMemberSelect {

    constructor(_selector, _projId){
      this.selector = _selector;
      this.projId = _projId;
    }

    async refreshMembers(){
      var response = await $.get(`${memberApiUrl}/all`);
      if(response.status == "Success"){
        $(this.selector).text('');

        var asMembersRes = await $.get(`${projectApiUrl}/id/${this.projId}?members`);

	console.log(asMembersRes);
        if(asMembersRes.status == "Success"){

          var uMembers = response.members.filter(e => {
            for(var i = 0; i < asMembersRes.members.length; i++) {
              if(e.id == asMembersRes.members[i].id) return false;
            }
            return true;
          });

          for(var i = 0; i < uMembers.length; i++){
            var mem = uMembers[i];
            $(this.selector).append(`<option value="${mem.id}">${mem.username}</option>`);
          }
        } else {
	  console.log("Couldn't get project members!");
	  return false;
	}
      } else {
	console.log("Couldn't get all members!");	
	return false;
      }
      return true;
    }

    getSelectedMemberId(){
      return $(this.selector).find(":selected").val();
    }

    async getSelectedMember(){
      var memId = $(this.selector).find(":selected").val();
      if(memId === undefined) {
        console.log("Nothing selected!!");
        return false;
      }

      var response = await $.get(`${memberApiUrl}/id/${memId}`);
      if(response.status == "Success"){
        return response.member;
      } else {
        console.log(`Error retrieving member with id: ${memId}`);
        return false;
      }
    }

    setSelectedMember(memId){
      $(this.selector).val(memId);
    }

    hide(){
      $(this.selector).hide();
    }

    show(){
      $(this.selector).show();      
    }

  }

  class ProjectMembersList {
    constructor (_selector, _projId){
      this.selector = _selector;
      this.projId = _projId;
    }

    async refreshMembers(){
      $(this.selector).text('');
      var response = await $.get(`${projectApiUrl}/id/${this.projId}?members`);
      console.log(response);
      if(response.status == "Success"){
        if(response.members.length == 0){
          $(this.selector).append(`<p class="text-indigo-500 font-bold"> No Members for your project yet! </p>`);
          return;
        }

	for(var i = 0; i < response.members.length; i++){
	  this.addProjectMemberUI(response.members[i]);
	}
      }
    }

    // adds member to project and updates the UI
    async addProjectMember(memId){
      var response = await $.post(`${projectApiUrl}/id/${this.projId}/add_member/${memId}`);
      if(response.status == "Success"){
	console.log("Member added successfully to project!");
	var memberRes = await $.get(`${memberApiUrl}/id/${memId}`);
	if(memberRes.status == "Success") {
          this.refreshMembers();
	} else {
	  console.log("Couldn't update UI..!");
	}
        return response.insertId.member_id;
      } else {
        console.log(`Error retrieving member with id: ${memId}`);
        return false;
      }      
    }

    addProjectMemberUI(member){
      $(this.selector).append(`
      <div class="flex justify-between" id="taskMember${member.id}">
        <li class="text-sm text-indigo-700 font-bold">${member.username}</li>
        <span><i class="fa fa-trash cursor-pointer text-sm text-red-600 hover:text-red-800 ml-auto transition-all" id="projMember${member.id}Delete"></i></span>
      </div>
      `);

      $(`#projMember${member.id}Delete`).unbind('click');
      $(`#projMember${member.id}Delete`).bind('click', this.memberDeleteHandler.bind(this));
    }

    async memberDeleteHandler(e){
      e.preventDefault();
      console.log(e);
      var memId = ProjectMembersList.getMemberId(e.target.id);
      console.log(memId);      
      if(window.confirm("Delete project member? Are you 100% Sure?")) {
	console.log("Deleting");
	try {
	  var response = await $.ajax({
	    method: 'delete',
	    url: `${projectApiUrl}/id/${this.projId}/delete_member/${memId}`,
	  });
	  if(response.status == "Success"){
            this.refreshMembers();
	    // $(e.target).parent().parent().remove();	 // #taskMember{member.id}>span>i
	  } else {
	    console.log("Unable to delete member!");
	  }	  
	} catch(error){
	  console.log("Some network error!");
	  console.log(error.message);
	}
      }      
    }

    // gets the member id from the elementID
    static getMemberId(elementId){
      return parseInt(elementId.match(/\d+/)[0]);      
    }

  } // end of projectmemberslist class
  
  var projMemberSelect = new ProjectMemberSelect('#projMembersSelect', data.proj.id);
  var projMemberList = new ProjectMembersList(`#projectMembersList`, data.proj.id);

  projMemberList.refreshMembers();

  var projMemberControls = {
    add: $(`#projectMemberAdd`),
    delete: $(`#projectMemberDelete`),
    confirm: $(`#projectMemberAddConfirm`),
    cancel: $(`#projectMemberAddCancel`),
  };

  projMemberControls.add.click(async (e) => {
    e.preventDefault();
    
    await projMemberSelect.refreshMembers();

    projMemberSelect.show();
    projMemberControls.cancel.show();
    projMemberControls.confirm.show();

    $(e.target).hide();

  });

  projMemberControls.confirm.click((e) => {
    e.preventDefault();
    console.log("confirming adding project member");
    var selectedId = projMemberSelect.getSelectedMemberId();
    
    if(projMemberList.addProjectMember(selectedId)){
      console.log("Member added!");
    } else {
      console.log("Member addition failed!");
    }

    projMemberSelect.hide();
    projMemberControls.cancel.hide();
    projMemberControls.confirm.hide();

    projMemberControls.add.show();

  });        

  projMemberControls.cancel.click((e) => {
    e.preventDefault();
    console.log("canceling project member");

    projMemberSelect.hide();
    projMemberControls.cancel.hide();
    projMemberControls.confirm.hide();

    projMemberControls.add.show();    
  });      



});


