// var memberApiUrl = "http://localhost:1234/api/v1/member";
// var memberProjectsUrl = `${memberApiUrl}/id/${user.id}?projects`;

// $.get(memberProjectsUrl, (data)=> {
//   var project = data.projects[0];
//   $("#projectId").text("Project ID: " + project.id);
//   $("#projectName").text(project.name);
//   $("#projectDescription").text(project.description);    
// });

$('input[name~="addProject"]').click((e) => {
  e.preventDefault();
  location.href = "/addproject";
});
