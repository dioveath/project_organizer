import { Router } from "express";
import Express from "express";

import TodoDB from "../../../services/todo_db.js";
import { validateTodo } from "../../../models/todo.js";
import { verifyToken } from "../../middlewares/verify_token.js";

const router = new Router();
const db = TodoDB.getInstance(); 

router.use(Express.json());

router.get("/id/:id", async (req, res) => {
  var proj = await db.getTodo(req.params.id);
  if(proj) 
    res.send(proj);
  else {
    res.send({
      status: "No Todo with ID: " + req.params.id, 
    });
  }
});


// gets all todo of task with id :id 
router.get("/task/:id", async (req, res) => {
  var todos = await db.getTaskTodos(req.params.id);
  if(todos) 
    res.send({
      todos: todos,
      status: "Success",
    });
  else {
    res.send({
      status: "Fail",
      message: "No Todos in Task with ID: " + req.params.id, 
    });
  }
});

router.get("/all", async (req, res) => {
  var todos = await db.getAllTodos();
  if(todos) {
    res.send({
      todos: todos, 
      status: "Success"
    });
  } else {
    res.send({
      status: "Fail",
      message: "There are No Todos at the moment."
    });
  }
});

router.post("/add", async (req, res) => {
  try {
    validateTodo(req.body);
    db.addTodo(req.body).then((todo) => {
      if(todo) {
        res.send({
          todo: todo,
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


router.post("/edit/:id", async (req, res) => {
  try {
    var todoId = await db.editTodo(req.params.id, req.body);
      if(todoId) {
        res.send({
          todoId: todoId,
          status: "Success"
        });
      } else {
        res.send({
          status: "Fail",
          message: "Failed to edit todo!"
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
  db.deleteTodo(req.params.id).then((id) => {
    if(id) {
      res.send({
	todoId: id,
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
