const mysql = require('mysql2/promise');
const Initializer = require('./Initializer');

class DB {
    constructor(host, username, password, db) {
        this.Host = host;
        this.Username = username;
        this.Password = password;
        this.Schema = db;
    }

    Get() {
        return mysql.createConnection({
            host: this.Host,
            user: this.Username,
            password: this.Password,
            database: this.Schema
        });
    }

    Initialize() {
        Initializer.Initialize(this.Get());
    }
}

module.exports = DB;