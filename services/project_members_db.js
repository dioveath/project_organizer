import db from "./db_service.js";

var instance; 
class ProjectMemberDB {

  static getInstance(){
    return instance ? instance : new ProjectMemberDB();
  }

  /*
  * gets all the project members in given project
  * @param {number} project id.
  * @return {array | bool}
  */
  async getAllMembers(projId){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM project_members where project_id=?";
        db.query(query, projId, (error, results) => {
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

  async getAllProjects(memberId){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM project_members where member_id=?";
        db.query(query, memberId, (error, results) => {
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

  async addProjectMember(projMember){
    try {
      const results = await new Promise((resolve, reject) => {
        // TODO: Find a way to not insert duplicates
        const query = "INSERT INTO project_members SET ?";
        db.query(query, projMember, (error, results) => {
          if(error) reject(error);
          resolve(results);
        });
      });

      if(results.affectedRows > 0) {
        console.log("Insert ID: " + results.insertId);
        var insertedProj = await this.getProjectMember(results.insertId);
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


  async getProjectMember(projMemberId){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM project_members WHERE id = ?";
        db.query(query, projMemberId, (error, results) => {
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


  async deleteProjectMember(projMemberId){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "DELETE FROM project_members WHERE id = ?";
        db.query(query, projMemberId, (error, results) => {
          if(error) reject(error);
          resolve(results);
        });
      });
      if(results.affectedRows > 0) {
        console.log(`Row with id:${projMemberId} deleted Successfully`);
        return projId;
      } else {
        console.log(`Error: No Row with id: ${projMemberId}`);
        return false;
      }
    } catch (error){
      console.log("DB Error: " + error.message);
      return false;
    }
  }

}


export default ProjectMemberDB;
