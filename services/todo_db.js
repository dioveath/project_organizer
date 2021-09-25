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

  async getTaskTodos(taskId){
    if(taskId == undefined) return false; //??
    try {
      const results = await new Promise((resolve, reject)=> {
        const query = "SELECT * FROM todos WHERE task_id=?";
        db.query(query, taskId, (error, results) =>{
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

  async editTodo(todoId, todo){
    try {
      const results = await new Promise((resolve, reject) => {

        var query = "UPDATE todos SET ";
        var fields = Object.keys(todo);

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

        db.query(query, [...Object.values(todo), todoId], (error, results) => {
          if(error) reject(error);
          resolve(results);
        });
      });
      if(results.affectedRows > 0) {
        console.log(`Update resulted in ${results.affectedRows} affected Row.`);
        return todoId;
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

  async deleteTodo(todoId){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "DELETE FROM todos WHERE id = ?";
        db.query(query, todoId, (error, results) => {
          if(error) reject(error);
          resolve(results);
        });
      });
      if(results.affectedRows > 0) {
        console.log(`Row with id:${todoId} deleted Successfully`);
        return todoId;
      } else {
        console.log(`Error: No Row with id: ${todoId}`);
        return false;
      }
    } catch (error){
      console.log("DB Error: " + error.message);
      return false;
    }
  }

  async getMemberTodos(memId){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM todos WHERE todo_assigned = ?";
        db.query(query, memId, (error, results) => {
          if(error) reject(error);
          resolve(results);
        });
      });
      if(results) {
        console.log(`Todos of member with id:${memId}`);
        return results;
      } else {
        console.log(`Error: No Todos of member with id: ${memId}`);
        return false;
      }
    } catch (error){
      console.log("DB Error: " + error.message);
      return false;
    }    
  }

}


export default TodoDB;
