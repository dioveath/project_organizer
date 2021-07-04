import { Router } from "express";
import Express from "express";

import ProjectDB from "../../services/project_db.js";
import { validateProject } from "../../models/project.js";
import { verifyToken } from "../middlewares/verify_token.js";

const router = new Router();
const db = ProjectDB.getInstance();

router.use(Express.json());

router.get("/id/:id", async (req, res) => {
  var proj = await db.getProject(req.params.id);
  if(proj) 
    res.send(proj);
  else {
    res.send({
      status: "No Project with ID: " + req.params.id, 
    });
  }
});

router.get("/all", async (req, res) => {
  var projs = await db.getAllProjects();
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
    validateProject(req.body);
    db.addProject(req.body).then((proj) => {
      if(proj) {
        res.send({
          proj: proj,
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

export default router;


