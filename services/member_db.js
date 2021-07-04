import db from "./db_service.js";

var instance; 

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

}


export default MemberDB;
