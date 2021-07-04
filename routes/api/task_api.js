import { Router } from "express";
import Express from "express";

import TaskDB from "../../services/task_db.js";
import { validateTask } from "../../models/task.js";
import { verifyToken } from "../middlewares/verify_token.js";

const router = new Router();
const db = TaskDB.getInstance(); 

router.use(Express.json());

router.get("/id/:id", async (req, res) => {
  var proj = await db.getTask(req.params.id);
  if(proj) 
    res.send(proj);
  else {
    res.send({
      status: "No Task with ID: " + req.params.id, 
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
    validateTask(req.body);
    db.addTask(req.body).then((task) => {
      if(task) {
        res.send({
          task: task,
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


router.delete("/delete/:id", verifyToken, async(req, res) => {
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

export default router;
