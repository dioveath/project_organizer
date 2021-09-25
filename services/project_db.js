/**
 *
 * File: db_service.js
 * Author: Saroj Rai @ CharichaSoftwares
 * Created On: Tuesday, 29 June 2021.
 *
 * Summary: This is for ...
 *
 * Copyright(c) 2021 All Rights Reserved for CharichaSoftwares
 */
import db from "./db_service.js";


var instance; 
class ProjectDB {

  static getInstance(){
    return instance ? instance : new ProjectDB();
  }

  async getAllProjects(options){
    try {
      const results = await new Promise((resolve, reject) => {
        var query = "SELECT * FROM projects";
        var qs = Object.keys(options);
        qs.forEach((op) => {
          if(op == "limit")
            query += " LIMIT " + options.limit;
          // if(op == "orderby")
          //   query += " ORDER BY " + options.orderby;
        });
        db.query(query, (error, results) => {
          if(error) reject(error);
          resolve(results);
        });
      });
      return results;
    } catch (error) {
      console.log("Error: " + error);
      return false;
    }
  }

  async addProject(proj){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "INSERT INTO projects SET ?";
        db.query(query, proj, (error, results) => {
          if(error) reject(error);
          resolve(results);
        });
      });

      if(results.affectedRows > 0) {
        console.log("Insert ID: " + results.insertId);
        var insertedProj = await this.getProject(results.insertId);
        return insertedProj;
      } else {
        console.log("Failed to insert row!");
        return false;
      }
    } catch (error) {
      console.log("DB Error: " + error);
      return false;
    }
  }


  async getProject(projId){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM projects WHERE id = ?";
        db.query(query, projId, (error, results) => {
          if(error) reject(error);
          resolve(results);
        });
      });
      return results[0];
    } catch (error){
      console.log("DB Error: " + error);
      return false;
    }
  }


  /*
   *   ...
   * }
   */
  async editProject(projId, proj){
    try {
      const results = await new Promise((resolve, reject) => {
        // TODO: improve upon updating project
        const query = "UPDATE  projects SET name=?, description=?, status=?, budget=?, start_date=?, end_date=?, project_manager=?, efforts_needed=?, efforts_put=?, progress=? WHERE id=?";
        db.query(query, [...Object.values(proj), projId], (error, results) => {
          if(error) reject(error);
          resolve(results);
        });
      });
      if(results.affectedRows > 0) {
        console.log(`Update resulted in ${results.affectedRows} affected Rows.`);
        return projId;
      } else {
        console.log(`Error: No Row with id: ${projId}`);
        return false;
      }
    } catch (error){
      console.log("DB Error: " + error.message);
      return false;
    }
  }
  
  async deleteProject(projId){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "DELETE FROM projects WHERE id = ?";
        db.query(query, projId, (error, results) => {
          if(error) reject(error);
          resolve(results);
        });
      });
      if(results.affectedRows > 0) {
        console.log(`Row with id:${projId} deleted Successfully`);
        return projId;
      } else {
        console.log(`Error: No Row with id: ${projId}`);
        return false;
      }
    } catch (error){
      console.log("DB Error: " + error.message);
      return false;
    }
  }


  async getProjectMembers(projId){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "select m.id, m.username, m.email, m.level, m.efforts_put, m.profile_image, m.color from members as m join project_members as pm on m.id = pm.member_id join projects as p on p.id = pm.project_id where p.id=?";
        db.query(query, projId, (error, results)=> {
          if(error) reject(error);
          resolve(results);
        });
      });

      if(results.length > 0){
        // console.log("Get the members for the project with id " + projId);
        return results;
      } else {
        console.log(`Error: No members found for the project with id ${projId}!`);
        return results;
      }
    } catch(error){
      console.log("DB Error: " + error.message);
      return false;
    }
  }

  
  async getProjectTasks(projId){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM tasks WHERE project_id=?";
        db.query(query, projId, (error, results)=> {
          if(error) reject(error);
          resolve(results);
        });
      });

      if(results.length > 0){
        // console.log("Get the tasks for the project with id " + projId);
        return results;
      } else {
        console.log(`Error: No tasks found for the project with id ${projId}!`);
        return results;
      }
    } catch(error){
      console.log("DB Error: " + error.message);
      return false;
    }
  }


  async getProjectTodos(projId){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "SELECT todos.* FROM (SELECT todos.id as todo_id, tasks.id as task_id, tasks.project_id FROM todos left join tasks on tasks.id = todos.task_id) as project_tasks join todos on project_tasks.todo_id = todos.id where project_id=?";
        db.query(query, projId, (error, results)=> {
          if(error) reject(error);
          resolve(results);
        });
      });

      if(results.length > 0){
        // console.log("Got the todos for the project with id " + projId);
        return results;
      } else {
        console.log(`Error: No todos found for the project with id ${projId}!`);
        return results;
      }
    } catch(error){
      console.log("DB Error: " + error.message);
      return false;
    }    
  }

  async deleteProjectMember(projId, memId){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "DELETE FROM project_members WHERE project_id=? and member_id=?";
        db.query(query, [projId, memId], (error, results) => {
          if(error) reject(error);
          resolve(results);
        });
      });
      if(results.affectedRows > 0) {
        console.log(`Removed member(id: ${memId}) from Project(id: ${projId}) Successfully`);
        return {projId, memId};
      } else {
        console.log(`Error: No member(id:${memId}) found for the project with id: ${projId}`);
        return false;
      }
    } catch (error){
      console.log("DB Error: " + error.message);
      return false;
    }
  }

}

 


export default ProjectDB;
