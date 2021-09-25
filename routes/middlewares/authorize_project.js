
import MemberDB from "../../services/member_db.js";

const mdb = MemberDB.getInstance();

async function authorizeProject(req, res, next){
  if(res.locals.user == undefined)
    return res.redirect("/auth/login");
  if(!(await mdb.hasProject(res.locals.user.id, req.params.id))){
    return res.render("pages/404page");
  }
  return next();
}


export default authorizeProject;
