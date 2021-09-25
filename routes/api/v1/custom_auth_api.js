import { Router } from "express";
import Express from "express";
import Bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { validateMember } from "../../../models/member.js";
import MemberDB from "../../../services/member_db.js";

import { authenticateToken } from "../../middlewares/authenticate_token.js";

const router = new Router();
const bcrypt = Bcrypt;
const db = MemberDB.getInstance();

router.use(Express.json());
router.use(Express.urlencoded({extended: true}));


function generateAccessToken(user){
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
}


router.post("/login", async (req, res) => {
  if(req.body.username === undefined || req.body.password === undefined) {
    res.send({
      status: "Fail",
      message: "Empty Credentials!"
    });
  }

  var member = await db.getMemberFromUsername(req.body.username);
  if(!member){
    return res.send({
      status: "Fail",
      message: `Couldn't find member with username '${req.body.username}'`
    });
  }
  
  if(!(await bcrypt.compare(req.body.password, member.password))) {
    return res.send({
      status: "Fail",
      message: "Login credentials are invalid!"
    });
  }

  var user = {
    id: member.id,
    username: member.username
  };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '48h'});
  
  var auth = {
    status: "Success",
    accessToken: accessToken,
    refreshToken: refreshToken
  };

  return res.send(auth);

});



router.post("/register", async (req, res) => {
  try {
    // validateMember(req.body); // will throw if not valid
    var member = req.body;
    member.password = await bcrypt.hash(req.body.password, 10);

    validateMember(member);
    var result = await db.addMember(member);
    if(result){
      res.send({
        status: "Success",
        message: "Registered successfully!"
      });      
    } else {
      res.send({
        status: "Fail",
        message: "Registration Unsuccessfull!"
      });
    }

  } catch(error){
    res.send({
      status: "Invalid",
      message: error.message
    });
  }

});


router.get("/auth_test", authenticateToken, (req, res) => {
  res.send({
    status: "Success",
    message: "Authentication successful!",
    user: req.user,
  });
});


router.post("/token", (req, res) => {
  
  const refreshToken = req.body.refreshToken;
  if(refreshToken == null) return res.sendStatus(401);

  // check refreshToken on database
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if(err) return res.sendStatus(403);
    const accessToken = generateAccessToken({id: user.id, username: user.username});
    return res.send({accessToken: accessToken});
  });

});


export default router;
