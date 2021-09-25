import { Router } from "express";
import Express from "express";

import ProjectMemberDB from "../../../services/project_members_db.js";
import ProjectDB from "../../../services/project_db.js";

const router = new Router();
const db = ProjectMemberDB.getInstance();
const pdb = ProjectDB.getInstance();

router.use(Express.json());


router.get("/id/:id", async(req, res) => { 
  var proj = await db.getAllMembers(req.params.id);
  if(proj) 
    res.send(proj);
  else {
    res.send({
      status: "No Project with ID: " + req.params.id, 
    });
  }
});


router.get("/all", async (req, res) => {
  var resObj = {};
  var qs = Object.keys(req.query);
  for(var i = 0; i < qs.length; i++){
    if(qs[i] == "memId") {
      var projs = await db.getAllProjects(req.query.memId);
      if(projs){
        resObj.status = "Success";
        resObj.memId = req.query.memId;
        resObj.projects = projs;
      } else {
        resObj.status = "Fail";
        resObj.message = "Fail to get projects of the memeber.";
      }
    } else if(qs[i] == "projId"){
      var membs = await db.getAllMembers(req.query.projId);
      if(membs){
        resObj.status = "Success";
        resObj.projId = req.query.projId;
        resObj.members = membs;
      } else {
        resObj.status = "Fail";
        resObj.message = "Fail to get members of the project.";
      }
    }
  }
  res.send(resObj);
});


router.post("/add", async (req, res) => {
  try {
    console.log(req.body);
    db.addProjectMember(req.body).then((projMember) => {
      if(projMember) {
        res.send({
          proj: projMember,
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
