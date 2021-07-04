import { Router } from "express";
import Express from "express";

import MemberDB from "../../services/member_db.js";
import { validateMember } from "../../models/member.js";
import { verifyToken } from "../middlewares/verify_token.js";

const router = new Router();
const db = MemberDB.getInstance(); 

router.use(Express.json());

router.get("/id/:id", async (req, res) => {
  var proj = await db.getMember(req.params.id);
  if(proj) 
    res.send(proj);
  else {
    res.send({
      status: "No Member with ID: " + req.params.id, 
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


router.delete("/delete/:id", verifyToken, async(req, res) => {
  db.deleteMember(req.params.id).then((id) => {
    if(id) {
      res.send({
	memberId: id,
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
