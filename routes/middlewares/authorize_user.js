import jwt from "jsonwebtoken";
import MemberDB from "../../services/member_db.js";


const mdb = MemberDB.getInstance();


// authorizes user and creates a locals.user for accessing user in views
function authorizeUser(req, res, next){
  var authUser = req.cookies['auth-user'];
  if(authUser == undefined || authUser.accessToken == undefined) 
    return res.redirect('/auth/login');

  jwt.verify(authUser.accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
    if(err) return res.redirect('/auth/login');
    var user = await mdb.getMember(decodedToken.id);
    res.locals.user = user || null;
    return next();
  });

}


export default authorizeUser;
