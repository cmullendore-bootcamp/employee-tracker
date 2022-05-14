const mysql = require('mysql2/promise');
const DB = require('../db/DB');
const Inquirer = require('inquirer');
const cTable = require("console.table");

class Role {
    constructor(db) {
        this.DB = db;
        this.Id = null;
        this.Title = null;
        this.Salary = null;
        this.DepartmentId = null;
    }

    async Load(id) {
        await this.DB.Get()
            .then(con => {
                return con.execute(`SELECT id, title, salary, department_id FROM employees.role WHERE id = ?`, [id]);
            })
            .then(([rows, fields]) => {
                if (rows.length > 0) {
                    this.Id = rows[0].id;
                    this.Title = rows[0].title;
                    this.Salary = rows[0].salary;
                    this.DepartmentId = rows[0].department_id;
                }
            });
    }

    async Save() {
        if (this.Id) {
            await this.DB.Get()
                .then(con => {
                    return con.execute(`UPDATE employees.role SET title = ?, salary = ?, department_id = ?`, [this.Title, this.Salary, this.DepartmentId])
                });
        } else {
            await this.DB.Get()
                .then(con => {
                    return con.execute(`INSERT INTO employees.role (title, salary, department_id) VALUES (?, ?, ?);`, [this.Title, this.Salary, this.DepartmentId])
                })
                .then(result => {
                    this.Id = result[0].insertId;
                    console.log(this);
                });
        }
    }

    static async GetRoles(db) {
        return await db.Get()
            .then(con => {
                return con.query(`SELECT r.title Title, r.id RoleID, d.name DepartmentName, r.salary Salary FROM role r JOIN department d ON r.department_id = d.id;`)
            })
            .then((rows, err) => {
                return rows[0];
            });
    }


    static async NewRole(db) {
        let depts = await db.Get()
            .then(con => {
                return con.query('SELECT d.name name, d.id value FROM department d ORDER BY d.name ASC;')
            })
            .then((rows, err) => {
                return rows[0];
            });

        return await Inquirer.prompt([{
                type: 'input',
                name: 'roleName',
                message: 'What will the new role be named?'
            }, {
                type: 'input',
                name: 'roleSalary',
                message: 'What will be the salary for the new role?'
            }, {
                type: 'list',
                name: 'roleDepartment',
                message: 'What department will the new role be in?',
                choices: depts
            }])
            .then(async ans => {
                return db.Get()
                    .then(async con => {
                        await con.execute(`INSERT INTO employees.role (title, salary, department_id) VALUES (?, ?, ?);`, [ans.roleName, ans.roleSalary, ans.roleDepartment]);
                    });
            })
            .then(async(rows, err) => {
                console.log(rows);
                return this.GetRoles(db);
            });
    }
}


module.exports = Role;