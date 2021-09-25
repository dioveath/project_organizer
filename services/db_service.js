import * as db from "mysql";
import Env from "dotenv";

Env.config();

var conn = db.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});


conn.connect((error) => {
  if(error){
    console.log("Error: " + error.message);
  }
  console.log("DB(MySQL): " + conn.state);
});


class DbService {
  static query(query, data, callback){
    conn.query(query, data, callback);
  }
}


export default DbService;
