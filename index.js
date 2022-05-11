const DB = require("./db/DB");

const db = new DB("localhost", "dbuser", "nothing", 'employees');

db.Initialize();

console.log("connected");