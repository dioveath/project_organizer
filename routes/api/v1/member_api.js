import { Router } from "express";
import Express from "express";
import Axios from "axios";

import MemberDB from "../../../services/member_db.js";
import ProjectDB from "../../../services/project_db.js";
// import ProjectMemberDB from "../../../services/project_members_db.js";
import TaskDB from "../../../services/task_db.js";
import TodoDB from "../../../services/todo_db.js";
import { validateMember } from "../../../models/member.js";
import { verifyToken } from "../../middlewares/verify_token.js";

const router = new Router();
const db = MemberDB.getInstance();
// const pmdb = ProjectMemberDB.getInstance();
const pdb = ProjectDB.getInstance();
const tdb = TaskDB.getInstance();
const tddb = TodoDB.getInstance();

router.use(Express.json());


router.get("/id/:id", async (req, res) => {
  var resObj = {};
  var qs = Object.keys(req.query);
  var member = await db.getMember(req.params.id);
  if(member){
    resObj.status = "Success";
    resObj.member = member;
  } else {
    resObj.status = "Fail";
    resObj.message = `Failed to get the member with id ${req.params.id}!`;
  }
  
  for(var i = 0; i < qs.length; i++){
    var qstring = qs[i];
    if(qstring == "projects") {
      var qvals = req.query["projects"].split('|');
      var options = {};
      for(var j = 0; j < qvals.length; j++){
        options[qvals[j]] = true;
      }

      var projs = await db.getMemberProjects(req.params.id, options);
      if(projs){
        resObj.status = "Success";
        resObj.projects = projs;
      } else {
        resObj.status = "Fail";
        resObj.message = "Fail to get projects of the member.";
      }
    } else if(qstring == "tasks"){
      var tasks = await tdb.getMemberTasks(req.params.id);
      for(var k = 0; k < tasks.length; k++){
        var assignedMembers = await tdb.getTaskMembers(tasks[j].id);
        tasks[j].assignedMembers = assignedMembers.map((e) => e.id);
      }

      if(tasks){
        resObj.status = "Success";
        resObj.tasks = tasks;
      } else {
        resObj.status = "Fail";
        resObj.message = "Fail to get tasks of the member.";            
      }
    } else if(qstring == "todos"){
      var todos = await tddb.getMemberTodos(req.params.id);
      if(todos){
        resObj.status = "Success";
        resObj.todos = todos;
      } else {
        resObj.status = "Fail";
        resObj.message = "Fail to get tasks of the member.";            
      }
    }
  }

  if(member) 
    res.send(resObj);
  else {
    res.send({
      status: "Fail", 
      message: "No Member with ID: " + req.params.id, 
    });
  }
});

router.get("/all", async (req, res) => {
  var members = await db.getAllMembers();
  if(members) {
    res.send({
      members: members, 
      status: "Success"
    });
  } else {
    res.send({
      status: "Fail",
      message: "There are No Members at the moment."
    });
  }
});

router.post("/add", async (req, res) => {
  try {
    validateMember(req.body);
    db.addMember(req.body).then((member) => {
      if(member) {
        res.send({
          member: member,
          status: "Success"
        });
      } else {
        res.send({
          status: "Fail"
        });
      }
    });
  } catch(error) {
    res.send({
      status: "Invalid", 
      message: error.message,
    });
  }
});


router.delete("/delete/:id", async(req, res) => {
  db.deleteMember(req.params.id).then((id) => {
    if(id){
      res.send({
	memberId: id,
	status: "Success"
      });
    } else {
      res.send({
	status: "Fail",
        message: id
      });
    }
  });
});


export default router;
