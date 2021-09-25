$(() => {

  $.ajax({
    async: false,
    url: "js/utils.js",
    dataType: "script"
  });
  $.ajax({
    async: false,
    url: "js/api.js",
    dataType: "script"
  });

  // TODO: enforce these later to everything |
  const PROJ_STATUS = ["active", "pending", "ongoing", "canceled"];  

  var name =   $('input[name="projectName"]')[0]; // these get direct DOM element 
  var description =   $('textarea[name="projectDesc"]')[0];
  var start_date =   $('input[name="projectStart"]')[0];
  var end_date =   $('input[name="projectEnd"]')[0];
  var budget = $('input[name="projectBudget"]')[0];
  var project_manager = $('select[name="projectManager"]')[0];
  var project_members = $('select[name="projectMembers"]')[0];

  loadProjectForm();

  $("#buttonAddProject").click(addProjectCallback);
  $(project_manager).on("change", "", (e)=> loadProjectForm());

  async function addProjectCallback(e) {
    e.preventDefault();

    res = await addProject(projectFormToDbObj());

    if(!res) {
      console.log("Add Project failed!");      
      return false;
    }

    var aMembers = $(project_members).val();

    console.log(aMembers);

    aMembers.forEach(mId => {
          addProjectMember({
            project_id: res.id,
            member_id: mId,
          });
    });
    return true;
  }

  async function loadProjectForm(){
    var members = await getAllMembers();
    var cmId = $("option:selected", $(project_manager)).val();

    members.forEach((m) => {
      if($(project_manager).find($(`option[value="${m.id}"]`)).length == 0) {
        $(project_manager).append($('<option>').val(m.id).text(m.username));
        if(cmId == undefined)
          cmId = $("option:selected", $(project_manager)).val();
      }
      if($(project_members).find($(`option[value="${m.id}"]`)).length == 0 &&
        m.id != cmId)
	$(project_members).append($('<option>').val(m.id).text(m.username));
    });

    if($(project_members).find($(`option[value="${cmId}"]`))){
      $(`option[value="${cmId}"]`, $(project_members)).remove();
    }

  }



  
  function projectFormToDbObj() {
    var dbProj = {
      name: name.value,
      description:    description.value,
      status: 0,
      start_date:  start_date.value, 
      end_date: end_date.value,
      budget: budget.value,
      project_manager:  project_manager.value,
      efforts_needed: 2000, // this would be approximate efforts needed (in working hours)
      efforts_put: 0,
    };
    return dbProj;
  }

});

