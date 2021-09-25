import jwt from "jsonwebtoken";
import MemberDB from "../../services/member_db.js";

const mdb = MemberDB.getInstance();

// NOTE: THIS MIDDLEWARE DOESN'T REDIRECT TO OTHER PAGE,  
// if user is logged in, we include user to this response.locals.user or set it to null;
function checkUser(req, res, next){
  var authUser = req.cookies['auth-user'];
  res.locals.user = null;
  if(authUser === undefined || authUser.accessToken === undefined) 
    return next();

  jwt.verify(authUser.accessToken, process.env.ACCESS_TOKEN_SECRET,
             async (err, decodedToken) => {
	       if(err) return next();
	       var user = await mdb.getMember(decodedToken.id);
	       res.locals.user = user || null;
	       return next();
	     });
}

export default checkUser;
