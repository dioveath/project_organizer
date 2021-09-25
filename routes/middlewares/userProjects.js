import jwt from "jsonwebtoken";
import MemberDB from "../../services/member_db.js";

const mdb = MemberDB.getInstance();

// check if authorized and get projects and saves to res.locals for use in views 
function userProjects(req, res, next){
  var authUser = req.cookies['auth-user'];
  if(authUser == undefined) 
    res.redirect('/auth/login');
  if(authUser.accessToken == undefined)
    res.redirect('/auth/login');

  jwt.verify(authUser.accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
    if(err) res.redirect('/auth/login');
    var projects = await mdb.getMemberProjects(decodedToken.id, { members: true, tasks: true });
    res.locals.projects = projects || null;
    next();
  });
}


export default userProjects;
