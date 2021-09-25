import db from "./db_service.js";
import ProjectDB from "./project_db.js";

var instance;
var pdb = ProjectDB.getInstance();

class MemberDB {

  static getInstance() {
    return instance ? instance: new MemberDB();
  }

  async getAllMembers(){
    try {
      const results = await new Promise((resolve, reject)=> {
        const query = "SELECT * FROM members";
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

  async addMember(member){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "INSERT INTO members SET ?";
        db.query(query, member, (error, results) => {
          if(error) reject(error);
          resolve(results);
        });
      });
      if(results.affectedRows > 0) {
        console.log("Insert ID: " + results.insertId);
        var insertedMember = await this.getMember(results.insertId);
        return insertedMember;
      } else {
        console.log("Failed to insert row!");
        return false;
      }
    } catch (error) {
      console.log("DB Error: " + error);
      return false;
    }
  }

  async getMember(memId){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM members WHERE id = ?";
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

  async getMemberFromEmail(email){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM members WHERE email = ?";
        db.query(query, email, (error, results) => {
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

  async getMemberFromUsername(username){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM members WHERE username = ?";
        db.query(query, username, (error, results) => {
          if(error) reject(error);
          resolve(results);
        });
      });
      if(results.length > 0)
        return results[0];
      else {
        console.log(`Not found with usernmae '${username}'`);
        return false;
      }
    } catch (error){
      console.log("DB Error: " + error);
      return false;
    }
  }

  /*
  * gets the projects of given member, 
  * NOTE: options { members: true, tasks: true, todos: true, working: true, managing: true}
  */
  async getMemberProjects(memId, options){


    try {
      const results = await new Promise((resolve, reject) => {

	var query = "select * from (select * from projects where project_manager=?) as mp union all (select p.id, p.name, p.description, p.status, p.budget, p.start_date, p.end_date, p.project_manager, p.efforts_needed, p.efforts_put, p.progress from projects as p join project_members as pm on p.id = pm.project_id where pm.member_id=?)";
	if(options.working && !options.managing) {
	  query = "select p.id, p.name, p.description, p.status, p.budget, p.start_date, p.end_date, p.project_manager, p.efforts_needed, p.efforts_put, p.progress from projects as p join project_members as pm on p.id = pm.project_id where pm.member_id=?";
	} else if(!options.working && options.managing){
	  query = "select * from projects where project_manager=?";
	}

        db.query(query, [memId, memId], (error, results) => {
          if(error) reject(error);
          resolve(results);
        });
      });

      if(results) {
        if(options != undefined) {
          for(var i = 0; i < results.length; i++) {
            if(options.members) {
              var mems = await pdb.getProjectMembers(results[i].id);
              results[i].members = mems;
            }
            if(options.tasks) {
              var tasks = await pdb.getProjectTasks(results[i].id);
              results[i].tasks = tasks;
            }
            if(options.todos) {
              // TODO: implement todos later
            }          
          }
        }

        // console.log(`Projects of member with id:${memId}!`);
        return results;
      } else {
        console.log(`Error: No Projects of member with id: ${memId}`);
        return false;
      }
    } catch (error){
      console.log("DB Error: " + error.message);
      return false;
    }
  }


  async deleteMember(memId){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "DELETE FROM members WHERE id = ?";
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


  async hasProject(memId, projId){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "select * from (select * from (select * from projects where project_manager=?) as mp union all (select p.* from projects as p join project_members as pm on p.id = pm.project_id where pm.member_id=?)) as ap where ap.id=?";
        db.query(query, [memId, memId, projId], (error, results) => {
          if(error) reject(error);
          resolve(results);
        });
      });
      if(results.length > 0) {
        console.log("it belongs");
        return true;
      } else {
        console.log("it doesn't belongs");        
        return false;
      }
    } catch (error){
      console.log("DB Error: " + error.message);
      return false;
    }
  }

  async isProjectManager(memId, projId){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "select * from projects where id=? and project_manager=?;";
        db.query(query, [memId, projId], (error, results) => {
          if(error) reject(error);
          resolve(results);
        });
      });
      if(results.length > 0) {
        console.log("it is project manager");
        return true;
      } else {
        console.log("it isn't project manager");        
        return false;
      }
    } catch (error){
      console.log("DB Error: " + error.message);
      return false;
    }    
  }
}


export default MemberDB;
