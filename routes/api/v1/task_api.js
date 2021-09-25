import { Router } from "express";
import Express from "express";

import TaskDB from "../../../services/task_db.js";
import { validateTask } from "../../../models/task.js";
import { verifyToken } from "../../middlewares/verify_token.js";

const router = new Router();
const db = TaskDB.getInstance(); 

router.use(Express.json());

router.get("/id/:id", async (req, res) => {
  var task = await db.getTask(req.params.id);
  if(task) {
    var qs = Object.keys(req.query);
    if(qs.includes("members")) {
      var assignedMembers = await db.getTaskMembers(task.id);
      task.assignedMembers = assignedMembers;
    }
    if(qs.includes("todos")) {
      var todos = await db.getAllTodos(task.id);
      task.todos = todos;
    }
    res.send({
      task: task,
      status: "Success",
    });
  }
  else {
    res.send({
      status: "Fail",
      message: "No Task with ID: " + req.params.id, 
    });
  }
});


// gets the tasks of project with :id
router.get("/project/:id", async (req, res) => {
  var tasks = await db.getProjectTasks(req.params.id);
  if(tasks) 
    res.send({
      tasks: tasks,
      status: "Success"
    });
  else {
    res.send({
      status: "Fail", 
      message: "No Tasks with Project ID: " + req.params.id, 
    });
  }
});


router.get("/all", async (req, res) => {
  var tasks = await db.getAllTasks();
  if(tasks) {
    res.send({
      tasks: tasks, 
      status: "Success"
    });
  } else {
    res.send({
      status: "Fail",
      message: "There are No Tasks at the moment."
    });
  }
});

router.post("/add", async (req, res) => {
  try {
    var task = await db.addTask(req.body);
    if(task) {
      res.send({
        task: task,
        status: "Success"
      });
    } else {
      res.send({
        status: "Fail",
        message: "There something wrong!"
      });
    }

  } catch(error) {
    res.send({
      status: "Invalid", 
      message: error.message,
    });
  }
});


router.post("/:id/update", async(req, res) => {
  try {
    var taskId = await db.updateTask(req.params.id, req.body);
    if(taskId){
      res.send({
        status: "Success",
        taskId: taskId,
      });
    } else {
      res.send({
        status: "Fail",
        message: "Failed to update task"
      });
    }

  } catch(error) {
    res.send({
      status: "Fail",
      message: error,
    });
  }
});


router.delete("/:id/delete", async(req, res) => {
  db.deleteTask(req.params.id).then((id) => {
    if(id) {
      res.send({
	taskId: id,
	status: "Success"
      });
    } else {
      res.send({
	status: "Fail"
      });
    }
  });
});


// add member to task
router.post("/:id/add_member", async (req, res) => {
  try {
    var tmRel = {
      task_id: req.params.id,
      member_id: req.body.member_id,
    };
    db.assignMemberToTask(tmRel).then((task_member) => {
      if(task_member) {
        res.send({
          task_member: task_member,
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

router.delete("/:id/delete_member", async (req, res) => {
  try {
    var tmRel = {
      task_id: parseInt(req.params.id),
      member_id: req.body.member_id,
    };
    console.log(tmRel);
    db.deleteMemberFromTask(tmRel).then((task_member) => {
      if(task_member) {
        res.send({
          task_member: task_member,
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


export default router;
