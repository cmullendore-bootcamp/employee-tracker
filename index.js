const DB = require("./db/DB");
const Role = require("./lib/Role");

const db = new DB("localhost", "dbuser", "nothing", 'employees');

db.Initialize();

let role = new Role(db);
role.Load(1);
console.log(role);