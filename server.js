
/**
 *
 * File: server.js
 * Author: Saroj Rai @ CharichaSoftwares
 * Created On: Tuesday, 29 June 2021.
 *
 * Summary: This is for ...
 *
 * Copyright(c) 2021 All Rights Reserved for CharichaSoftwares
 */

import Express from "express";
import ExpressEJSLayouts from "express-ejs-layouts";
import Axios from "axios";
import CookieParser from "cookie-parser";

// Routes
import ProjectRoute from "./routes/api/v1/project_api.js";
import MemberRoute from "./routes/api/v1/member_api.js";
import TaskRoute from "./routes/api/v1/task_api.js";
import TodoRoute from "./routes/api/v1/todo_api.js";
import ProjectMemberRoute from "./routes/api/v1/project_members_api.js";

// auth routes
import CustomAuthAPI from "./routes/api/v1/custom_auth_api.js";
import AuthRoute from "./routes/auth/auth_route.js";

// middlewares
import authorizeUser  from "./routes/middlewares/authorize_user.js";
import userProjects  from "./routes/middlewares/userProjects.js";
import authorizeProject  from "./routes/middlewares/authorize_project.js";


const app = Express();

// API Routes
app.use("/api/v1/project", ProjectRoute);
app.use("/api/v1/member", MemberRoute);
app.use("/api/v1/task", TaskRoute);
app.use("/api/v1/todo", TodoRoute);
app.use("/api/v1/project_member", ProjectMemberRoute);

app.set("view engine", "ejs");
app.use(Express.static("public"));
app.set("layout", "layouts/layout");
app.use(ExpressEJSLayouts);
app.use(CookieParser());

// auth API routes
app.use("/auth/v1/cus", CustomAuthAPI);


// client routes
var apiUrl = "http://localhost:1234/api/v1";


app.get("/", (_req, res)=> {
  // res.render("index");
  res.redirect("/auth/login");
});


// auth routes
app.use("/auth", AuthRoute);

// app.get("/register", (req, res) => {
//   res.render("pages/register");
// });


app.get("/dashboard", [authorizeUser, userProjects], async(req, res) => {
  res.render("pages/dashboard");
});


app.get("/project/:id", [authorizeUser, authorizeProject], async (req, res) => {
  var axRes = await Axios.get(`${apiUrl}/project/id/${req.params.id}`,
                              { params: { members: 1, tasks: 1, todos: 1 }});
  var data = axRes.data;
  if(data.status == "Fail")
    return res.render("pages/404page");
  return res.render("pages/project", {data});
});

app.get("/project/:id/tasks", async (req, res) => {
  var axRes = await Axios.get(`${apiUrl}/project/id/${req.params.id}`,
                              { params: { members: 1, tasks: 1, todos: 1 }});
  var data = axRes.data;
  if(data.status == "Fail")
    return res.render("pages/404page");
  return res.render("partials/task_manager", {data});
});


app.get("/project/:id/edit", [authorizeUser], async (req, res) => {
  var axRes = await Axios.get(`${apiUrl}/project/id/${req.params.id}`,
                              { params: { members: 1, tasks: 1, todos: 1 }});
  var data = axRes.data;
  if(data.status == "Fail")
    return res.render("pages/404page");
  return res.render("pages/edit_project", {data});
});


app.get("/addproject", [authorizeUser], (_req, res) => {
  res.render("pages/add_project");
});


app.get("/member/:id", async (req, res) => {
  var axRes = await Axios.get(`${apiUrl}/member/id/${req.params.id}`);
  var member = axRes.data;
  res.render("pages/member", {member});
});


app.listen(process.env.PORT,
           () => console.log(`Listening to http://localhost:${process.env.PORT}`));
