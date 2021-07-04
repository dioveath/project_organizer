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

// Routes
import ProjectRoute from "./routes/api/project_api.js";
import MemberRoute from "./routes/api/member_api.js";
import TaskRoute from "./routes/api/task_api.js";
import TodoRoute from "./routes/api/todo_api.js";

const app = Express();

// API Routes
app.use("/api/project", ProjectRoute);
app.use("/api/member", MemberRoute);
app.use("/api/task", TaskRoute);
app.use("/api/todo", TodoRoute);


app.set("view engine", "ejs");
app.use(Express.static("public"));
app.set("layout", "layouts/layout");
app.use(ExpressEJSLayouts);

// client routes
app.get("/", (_req, res)=> {
  res.render("index");
});

app.get("/addproject", (_req, res) => {
  res.render("");
});


app.listen(process.env.PORT,
           () => console.log(`Listening to http://localhost:${process.env.PORT}`));
