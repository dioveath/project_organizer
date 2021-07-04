import db from "./db_service.js";

var instance; 

class TodoDB {

  static getInstance() {
    return instance ? instance: new TodoDB();
  }

  async getAllTodos(){
    try {
      const results = await new Promise((resolve, reject)=> {
        const query = "SELECT * FROM todos";
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

  async addTodo(todo){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "INSERT INTO todos SET ?";
        db.query(query, todo, (error, results) => {
          if(error) reject(error);
          resolve(results);
        });
      });
      if(results.affectedRows > 0) {
        console.log("Insert ID: " + results.insertId);
        var insertedTodo = await this.getTodo(results.insertId);
        return insertedTodo;
      } else {
        console.log("Failed to insert row!");
        return false;
      }
    } catch (error) {
      console.log("DB Error: " + error);
      return false;
    }
  }

  async getTodo(memId){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM todos WHERE id = ?";
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

  async deleteTodo(memId){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "DELETE FROM todos WHERE id = ?";
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


export default TodoDB;
