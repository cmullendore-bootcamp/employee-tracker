const DB = require("./db/DB");
const Prompter = require('./lib/Prompter');

const db = new DB("localhost", "dbuser", "nothing", 'employees');

db.Initialize();

const prompter = new Prompter(db);
prompter.Start();