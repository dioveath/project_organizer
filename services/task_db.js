import db from "./db_service.js";

var instance; 

class TaskDB {

  static getInstance() {
    return instance ? instance: new TaskDB();
  }

  async getAllTasks(){
    try {
      const results = await new Promise((resolve, reject)=> {
        const query = "SELECT * FROM tasks";
        db.query(query, (error, results) =>{
          if(error) reject(error);
          resolve(results);
        });
      });
      return results;
    }
    catch (error) {
      console.log("Error: " + error);
      return false;
    }
  }

  async getProjectTasks(projId){
    try {
      const results = await new Promise((resolve, reject)=> {
        const query = "SELECT * FROM tasks WHERE project_id=?";
        db.query(query, projId, (error, results) =>{
          if(error) reject(error);
          resolve(results);
        });
      });
      return results;
    }
    catch (error) {
      console.log("Error: " + error);
      return false;
    }
  }


  async getTaskMembers(taskId){
    try {
      const results = await new Promise((resolve, reject)=> {
        const query = "select * from members as m left join task_members as tm on tm.member_id=m.id where tm.task_id=?";
        db.query(query, taskId, (error, results) =>{
          if(error) reject(error);
          resolve(results);
        });
      });
      console.log(results);
      return results;
    }
    catch (error) {
      console.log("Error: " + error);
      return false;
    }
  }  


  async addTask(task){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "INSERT INTO tasks SET ?";
        db.query(query, task, (error, results) => {
          if(error) reject(error);
          resolve(results);
        });
      });
      if(results.affectedRows > 0) {
        console.log("Insert ID: " + results.insertId);
        var insertedTask = await this.getTask(results.insertId);
        console.log(insertedTask);
        return insertedTask;
      } else {
        console.log("Failed to insert row!");
        return false;
      }
    } catch (error) {
      console.log("DB Error: " + error);
      return false;
    }
  }

  async updateTask(taskId, task){
    try {
      const results = await new Promise((resolve, reject) => {

        var query = "UPDATE tasks SET ";
        var fields = Object.keys(task);

        if(fields.length == 0) throw 'Edit Fields are empty!';

        fields.forEach((k, i) => {
          query += `${k}=?`;
          if(i == fields.length-1)
            query += " ";
          else
            query += ", ";
        });
        query += `WHERE id=?`;

        console.log(query);

        db.query(query, [...Object.values(task), taskId], (error, results) => {
          if(error) reject(error);
          resolve(results);
        });
      });
      if(results.affectedRows > 0) {
        console.log(`Update resulted in ${results.affectedRows} affected Row.`);
        return taskId;
      } else {
        console.log("Failed to insert row!");
        return false;
      }
    } catch (error) {
      console.log("DB Error: " + error);
      return false;
    }
  }

  async getTask(taskId){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM tasks WHERE id = ?";
        db.query(query, taskId, (error, results) => {
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

  async deleteTask(taskId){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "DELETE FROM tasks WHERE id = ?";
        db.query(query, taskId, (error, results) => {
          if(error) reject(error);
          resolve(results);
        });
      });
      if(results.affectedRows > 0) {
        console.log(`Row with id:${taskId} deleted Successfully`);
        return taskId;
      } else {
        console.log(`Error: No Row with id: ${taskId}`);
        return false;
      }
    } catch (error){
      console.log("DB Error: " + error.message);
      return false;
    }
  }


  async assignMemberToTask(task_member){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "INSERT INTO task_members SET ?";
        db.query(query, task_member, (error, results) => {
          if(error) reject(error);
          resolve(results);
        });
      });
      if(results.affectedRows > 0) {
        console.log("Insert ID: " + results.insertId);
        return task_member;
      } else {
        console.log("Failed to insert row!");        
        return false;
      }
    } catch (error){
      console.log("DB Error: " + error.message);
      return false;
    }
  }

  async deleteMemberFromTask(task_member){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "delete from task_members where task_id=? and member_id=?";
        db.query(query, [task_member.task_id, task_member.member_id], (error, results) => {
          if(error) reject(error);
          resolve(results);
        });
      });
      console.log(results);
      if(results.affectedRows > 0) {
        console.log("Deleted ID: " + results.insertId);
        return task_member;
      } else {
        console.log("Failed to delete row!");        
        return false;
      }
    } catch (error){
      console.log("DB Error: " + error.message);
      return false;
    }
  }   


  // gets all the tasks of given memberId
  async getMemberTasks(memId){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "SELECT t.id, t.name, t.description, t.efforts_needed, t.efforts_put, t.progress FROM tasks AS t JOIN task_members AS tm ON t.id = tm.member_id WHERE tm.member_id=?";
        db.query(query, memId, (error, results) => {
          if(error) reject(error);
          resolve(results);
        });
      });
      if(results) {
        console.log(`Tasks of member with id:${memId}`);
        return results;
      } else {
        console.log(`Error: No Task with member of id: ${memId}`);
        return false;
      }
    } catch (error){
      console.log("DB Error: " + error.message);
      return false;
    }
  }

  // gets all the todos of the task with given id
  async getAllTodos(taskId){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM todos WHERE task_id=?";
        db.query(query, taskId, (error, results) => {
          if(error) reject(error);
          resolve(results);
        });
      });
      if(results) {
        console.log(`Todos of task with id:${taskId}`);
        return results;
      } else {
        console.log(`Error: No todos with task of id: ${taskId}`);
        return false;
      }
    } catch (error){
      console.log("DB Error: " + error.message);
      return false;
    }
  }  

}


export default TaskDB;
