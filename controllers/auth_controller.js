import Axios from "axios";


const authApiUrl = "http://localhost:1234/auth/v1/cus";

let getLogin = function (req, res) {
  if(res.locals.user) // NOTE: we get user from previous middleware if there is any or null
    return res.redirect("/dashboard");
  return res.render("pages/login");
};

let postLogin = async function (req, res) {
  try {
    var loginRes = await Axios.post(`${authApiUrl}/login`, req.body);
    if(loginRes.data.status == "Fail"){
      res.send(loginRes.data);
    } else {
      res.cookie('auth-user', loginRes.data, {maxAge: 900000, httpOnly: true});
      res.send(loginRes.data);
    }
  } catch (error){
    res.send({
      status: "Fail",
      message: "Couldn't login, " + error.message
    });
  }
};

let getRegister = function (req, res) {
  res.render("pages/register");
};

let postRegister = async function (req, res) {
  try {
    var regRes = await Axios.post(`${authApiUrl}/register`, req.body);
    if(regRes.data.status == "Fail") {
      res.send(regRes.data);
    } else {
      var loginRes = await Axios.post(`${authApiUrl}/login`, { username: req.body.username, password: req.body.password });
      if(loginRes.data.status == "Fail"){
        res.send(loginRes.data);
      } else {
        res.cookie('auth-user', loginRes.data, {maxAge: 900000, httpOnly: true });
        res.send(loginRes.data);
      }
    }
  } catch (error) {
    res.send({
      status: "Fail",
      message: "Couldn't login, " + error.message
    });
  }
};


let getLogout = function(req, res) {
  res.locals.user = null;
  res.cookie('auth-user', '', { maxAge: 1 });
  res.redirect("/");
};


export { getLogin, postLogin, getRegister, postRegister, getLogout};
