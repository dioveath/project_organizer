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

  async getAllProjects(){
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM projects";
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

}


export default ProjectDB;
