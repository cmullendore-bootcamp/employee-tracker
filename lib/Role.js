const mysql = require('mysql2/promise');
const { threadId } = require('worker_threads');
const DB = require('../db/DB');

class Role {
    constructor(db) {
        this.DB = db;
        this.Id = null;
        this.Title = null;
        this.Salary = null;
        this.DepartmentId = null;
    }

    Load(id) {
        this.DB.Get()
            .then(con => {
                const res = con.execute(`SELECT id, title, salary, department_id FROM employees.role WHERE id = ?`, [id]);
                con.release();
                return res;
            })
            .then(res => {
                console.log(res);
                if (res.length > 0) {
                    this.Id = rows[0].id;
                    this.Title = rows[0].title;
                    this.Salary = rows[0].salary;
                    this.DepartmentId = rows[0].department_id;
                }
            })
            .then(() => console.log(this));
    }
}


module.exports = Role;