$(() => {

  $.getScript("js/utils.js");
  $.getScript("js/chart_manager.js");

  $.ajax({
    async: false,
    url: "js/api.js",
    dataType: "script"
  });

  // fetch('http://localhost:1234/allprojects')
  //   .then(res => res.json()).then(data => loadProjectTable(data));

  // initDocument();
  loadProjectDashboard();

  async function initDocument(){
    var allProjs = await getAllProjects();
    console.log(allProjs);
    loadProjectTable(allProjs);
  }

  function loadProjectTable(data) {
    data.forEach((proj) => {
      addProjectToTable(proj);
    });
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


  $("#buttonAddProject").click(addProjectCallback);

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

  function addProjectCallback(e){
    e.preventDefault();
    addProject(projectFormToDbObj()).then((res) => {
      if(res) {
        addProjectToTable(res);
      } else {
        console.log("Project addition failed!");
      }
    });
  }


  function loadProjectDashboard(){
    // loadChart();
  }

});


