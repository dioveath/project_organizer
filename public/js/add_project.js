$(() => {

  var projectApiUrl = "http://localhost:1234/api/v1/project";

  $('input[name~="createProject"]').click(async (e) => {
    e.preventDefault();
    $("#error").text("");

    var projectName =  $('input[name~="projectName"]').val();
    var projectDescription =  $('input[name~="projectDescription"]').val();
    var projectBudget =  $('input[name~="projectBudget"]').val();  
    var projectStart =  $('input[name~="projectStart"]').val();
    var projectEnd = $('input[name~="projectEnd"]').val();


    // some validation
    if(!projectName || !projectDescription || !projectStart || !projectEnd) {
      
    }

    if(projectBudget < 0) {
      var error = "Are you sure you're doing this project with budget on negative? a Big NOoo";
      console.log(error);
      return;
    }

    var project = {
      name: projectName,
      description: projectDescription,
      status: "active",
      budget: projectBudget,
      start_date: projectStart, 
      end_date: projectEnd,
      project_manager: user.id,
      progress: 0,
      efforts_needed: 1000,
      efforts_put: 0,
    };

    console.log(project);

    $.post({
      url: `${projectApiUrl}/add`,
      data: JSON.stringify(project),
      contentType: 'application/json; charset=utf-8',
      success: (data) => {
    	console.log(data);
    	if(data.status !== "Success") {
    	  $("#error").text(data.message);
    	  return;
    	}
        // TODO: redirect to currently created project page.
        location.href = "/dashboard";
      }
    });
    
    

  });


});

