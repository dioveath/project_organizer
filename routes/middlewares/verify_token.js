// import jwt from "jsonwebtoken";

function verifyToken(req, res, next){
  const token = req.header('auth-token');
  if(!token)
    return res.status(401).send({
      message: "Access Denied",
    });
  try {

    // TODO: Implement JWT Token
    // const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    if(token != process.env.TOKEN_SECRET)
      throw Error("Invalid Token");

      return next();
  } catch (error) {
    return res.status(400).send({
      message: error.message
    });
  } 
}

export { verifyToken };
