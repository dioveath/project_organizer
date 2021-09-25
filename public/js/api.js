/**
 *
 * File: api.js
 * Author: Saroj Rai @ CharichaSoftwares
 * Created On: Tuesday, 29 June 2021.
 *
 * Summary: Rest API for Projects Organizer
 *
 * Copyright(c) 2021 All Rights Reserved for CharichaSoftwares
 */

const host = "http://localhost:1234/api/v1";


async function deleteProject(projId) {
  try {
    const response = await new Promise((resolve, reject) => {
      const url = host + "/project/delete/" + projId;
      console.log(url);
      $.ajax({
	url: url,
	type: "DELETE",
        headers: {
          "auth-token": "thisistokensecretrandom"
        }, 
	success: (result) => {
	  console.log(result);
	  resolve(result);
	},
	error: (req, status, error) => {
	  reject(error);
	}
      });
    });
    // check response if deletion
    if (response.status == "Success")
      return true;
    else
      return false;
  } catch (error) { // network error
    console.log(error);
    return false;
  }
}


async function addProject(proj) {
  try {
    const response = await new Promise((resolve, reject) => {
      const url = host + "/project/add";
      console.log(proj);
      $.ajax({
      	url: url,
      	type: "POST",
        contentType: "application/json",
      	data: JSON.stringify(proj),
      	success: (result) => {
      	  console.log(result);
      	  resolve(result);
      	},
      	error: (req, status, error) => {
      	  reject(error);
      	},
      });
    });
    // check response if added
    if (response.status == "Success")
      return response.proj;
    else
      return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}


async function getAllProjects(){
    try {
    const response = await new Promise((resolve, reject) => {
      const url = host + "/project/all";
      $.ajax({
	url: url,
	type: "GET",
	success: (result) => {
	  resolve(result);
	},
	error: (req, status, error) => {
	  reject(error);
	}
      });
    });
    // check response if added
    if (response.status == "Success")
      return response.projs;
    else
      return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}


async function getProjectTasks(projId){
  try {
    const response = await new Promise((resolve, reject) => {
      const url = host + "/task/project/" + projId;
      $.ajax({
	url: url,
	type: "GET",
	success: (result) => {
	  resolve(result);
	},
	error: (req, status, error) => {
	  reject(error);
	}
      });
    });
    if (response.status == "Success")
      return response.tasks;
    else
      return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}


async function getTaskTodos(taskId){
  try {
    const response = await new Promise((resolve, reject) => {
      const url = host + "/todo/task/" + taskId;
      $.ajax({
	url: url,
	type: "GET",
	success: (result) => {
	  resolve(result);
	},
	error: (req, status, error) => {
	  reject(error);
	}
      });
    });
    if (response.status == "Success")
      return response.todos;
    else
      return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}


async function getMember(memId){
    try {
    const response = await new Promise((resolve, reject) => {
      const url = host + "/member/id/" + memId;
      $.ajax({
	url: url,
	type: "GET",
	success: (result) => {
	  resolve(result);
	},
	error: (req, status, error) => {
	  reject(error);
	}
      });
    });
    if (response.status == "Success")
      return response.member;
    else
      return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}


async function getAllMembers(){
    try {
    const response = await new Promise((resolve, reject) => {
      const url = host + "/member/all";
      $.ajax({
	url: url,
	type: "GET",
	success: (result) => {
	  resolve(result);
	},
	error: (req, status, error) => {
	  reject(error);
	}
      });
    });
    // check response if added
    if (response.status == "Success")
      return response.members;
    else
      return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}




async function addProjectMember(projMember){
  console.log(projMember);
    try {
    const response = await new Promise((resolve, reject) => {
      const url = host + "/project_member/add";
      $.ajax({
	url: url,
	type: "POST",
        contentType: "application/json",
      	data: JSON.stringify(projMember),        
	success: (result) => {
	  resolve(result);
	},
	error: (req, status, error) => {
	  reject(error);
	}
      });
    });
    // check response if added
    if (response.status == "Success")
      return response.members;
    else
      return false;
  } catch (error) {
    console.log(error);
    return false;
  }

}


async function getAllProjectMembers(projId){
    try {
    const response = await new Promise((resolve, reject) => {
      const url = host + "/project_member/all/" + projId;
      $.ajax({
	url: url,
	type: "GET",
	success: (result) => {
	  resolve(result);
	},
	error: (req, status, error) => {
	  reject(error);
	}
      });
    });
    if (response.status == "Success")
      return response.projMembers;
    else
      return false;
  } catch (error) {
    console.log(error);
    return false;
  }

}

