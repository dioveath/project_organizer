$(() => {

  var projectApiUrl = "http://localhost:1234/api/v1/project";
  let jsToSqlDate = d => d.toISOString().slice(0, 10).replace('T', ' ');
  var proj = data.proj;

  var projectName =  $('input[name~="projectName"]');
  var projectDescription =  $('input[name~="projectDescription"]');
  var projectBudget =  $('input[name~="projectBudget"]');
  var projectStart =  $('input[name~="projectStart"]');
  var projectEnd = $('input[name~="projectEnd"]');

  projectName.val(proj.name);
  projectDescription.val(proj.description);
  projectBudget.val(proj.budget);

  projectStart.val(proj.start_date.slice(0, 10).replace('T', ' '));
  projectEnd.val(proj.end_date.slice(0, 10).replace('T', ' '));


  $('input[name~="editProject"]').click(async (e) => {
    e.preventDefault();
    $("#error").text("");

    // some validation
    if(!projectName.val() || !projectDescription.val() || !projectStart.val() || !projectEnd.val()) {
      return;
    }

    if(projectBudget < 0) {
      var error = "Are you sure you're doing this project with budget on negative? a Big NOoo";
      console.log(error);
      return;
    }

    var data = {
      name: projectName.val(),
      description: projectDescription.val(),
      status: "active",
      budget: projectBudget.val(),
      start_date: projectStart.val(),
      end_date: projectEnd.val(),
      project_manager: user.id,
      efforts_needed: 1000,
      efforts_put: 0,
      progress: 0,
    };

    $.post({
      url: `${projectApiUrl}/${proj.id}/edit`,
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: (data) => {
        console.log(data);
    	if(data.status !== "Success") {
    	  $("#error").text(data.message);
    	  return;
    	}
        // TODO: redirect to currently edited project page.
        location.href = `/project/${data.projId}`;
      },
    });

  });


});
