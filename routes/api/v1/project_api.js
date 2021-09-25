import { Router } from "express";
import Express from "express";

import ProjectDB from "../../../services/project_db.js";
import ProjectMemberDB from "../../../services/project_members_db.js";
import MemberDB from "../../../services/member_db.js";
import TaskDB from "../../../services/task_db.js";
import { validateProject } from "../../../models/project.js";
import { verifyToken } from "../../middlewares/verify_token.js";

const router = new Router();
const db = ProjectDB.getInstance();
const pmdb = ProjectMemberDB.getInstance();
const mdb = MemberDB.getInstance();
const tdb = TaskDB.getInstance();


router.use(Express.json());

// e.g.- http://localhost:1234/api/v1/project/all?limit=5&query=members|tasks
router.get("/id/:id", async (req, res) => {

  var resObj = {};
  var qs = Object.keys(req.query);
  var proj = await db.getProject(req.params.id);
  if(proj) {
    resObj.status = "Success";
    resObj.proj = proj;
  } else {
    resObj.status = "Fail";    
    resObj.message = "Failed to get the project!";
  }

  for(var i = 0; i < qs.length; i++){
    var qstring = qs[i];
    if(qstring == "members") {
      // get members ------------
      var members = await db.getProjectMembers(req.params.id);
      if(members){
        resObj.status = "Success";        
        resObj.members = members;
      } else {
        resObj.status = "Fail";
        resObj.message = "Failed to get the members";
      }
    } else if(qstring == "tasks"){
      // get tasks ---------------
      var tasks = await db.getProjectTasks(req.params.id);

      for(var j = 0; j < tasks.length; j++){
        var assignedMembers = await tdb.getTaskMembers(tasks[j].id);
        tasks[j].assignedMembers = assignedMembers;
        if(qs.includes("todos")) {
          var todos = await tdb.getAllTodos(tasks[j].id);
          tasks[j].todos = todos;
        }
      }        

      if(tasks){
	resObj.status = "Success";
	resObj.tasks = tasks;
      } else {
	resObj.status = "Fail";
	resObj.message = "Failed to get Tasks!";
      }
    }

  } // end for loop

  res.send(resObj);
});



router.get("/all", async (req, res) => {
  var projs = await db.getAllProjects(req.query);
  if(projs) {
    res.send({
      projs: projs, 
      status: "Success"
    });
  } else {
    res.send({
      status: "Fail",
      message: "There are No Projects at the moment."
    });
  }
});


router.post("/add", async (req, res) => {
  try {
    console.log(req.body);
    validateProject(req.body);
    var proj = await db.addProject(req.body);
      if(proj) {
        res.send({
          proj: proj,
          status: "Success"
        });
      } else {
        res.send({
          status: "Fail",
          message: "Failed to add project!"
        });
      }
  } catch(error) {
    res.send({
      status:  "Invalid", 
      message: error.message,
    });
  }
});


router.post("/:id/edit", async (req, res) => {
  try {
    validateProject(req.body);
    var projId = await db.editProject(req.params.id, req.body);
      if(projId) {
        res.send({
          projId: projId,
          status: "Success"
        });
      } else {
        res.send({
          status: "Fail",
          message: "Failed to edit project!"
        });
      }
  } catch(error) {
    res.send({
      status: "Invalid", 
      message: error.message,
    });
  }
});


router.delete("/delete/:id", verifyToken, async(req, res) => {
  db.deleteProject(req.params.id).then((done) => {
    if(done) {
      res.send({
	projId: done,
	status: "Success"
      });
    } else {
      res.send({
	status: "Fail"
      });
    }
  });
});


router.post("/id/:id/add_task", async(req, res) => {
  var task = req.body;
  task.project_id = req.params.id;
  var doneTask = await tdb.addTask(task);
  if(doneTask){
    res.send({
      task: doneTask,
      status: "Success"
    });
  } else {
    res.send({
      status: "Fail",
      message: `Failed to add task to project with id ${req.params.id}`
    });
  }
});


// TODO: create a middleware router to authorize based on roles
//       for manipulating project.
router.delete("/id/:id/delete_task/:tid", async(req, res) => {
  var result = await tdb.deleteTask(req.params.tid);
  if(result){
    res.send({
      task: result,
      status: "Success"
    });
  } else {
    res.send({
      status: "Fail",
      message: `Failed to delete task id ${req.params.id} from the project!`
    });
  }
});


router.post("/id/:id/add_member/:mid", async(req, res) => {
  var projMember = {
    project_id: req.params.id,
    member_id: req.params.mid
  };
  var projMem = await pmdb.addProjectMember(projMember);
  if(projMem){
    res.send({
      insertId: projMem,
      status: "Success"
    });
  } else {
    res.send({
      status: "Fail",
      message: `Failed to add member to project with id ${req.params.id}`
    });
  }
});

router.delete("/id/:id/delete_member/:mid", async(req, res) => {
  var projMem = await db.deleteProjectMember(req.params.id, req.params.mid);
  if(projMem){
    res.send({
      relationObj: projMem,
      status: "Success"
    });
  } else {
    res.send({
      status: "Fail",
      message: `Failed to add member to project with id ${req.params.id}`
    });
  }
});


export default router;
