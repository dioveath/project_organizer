import { MongoClient } from 'mongodb';
import Env from "dotenv";

Env.config();

const uri = "mongodb+srv://org_admin:<password>@cluster0.hxt6p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(error => {
  client.db("admin").command({ping: 1}).then((error)=> {
    console.log("DB: " + error);
    // console.dir();
  });
  console.log("DB(MongoDB): " + "connected");
  if(error){
    console.log("DB: " + error.message);
  }
});


export default client;
