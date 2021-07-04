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

  async getTask(memId){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM tasks WHERE id = ?";
        db.query(query, memId, (error, results) => {
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

  async deleteTask(memId){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "DELETE FROM tasks WHERE id = ?";
        db.query(query, memId, (error, results) => {
          if(error) reject(error);
          resolve(results);
        });
      });
      if(results.affectedRows > 0) {
        console.log(`Row with id:${memId} deleted Successfully`);
        return memId;
      } else {
        console.log(`Error: No Row with id: ${memId}`);
        return false;
      }
    } catch (error){
      console.log("DB Error: " + error.message);
      return false;
    }
  }

}


export default TaskDB;
