const Inquirer = require('inquirer');

class Departments {
    constructor() {}

    static async GetDepartments(db) {
        return await db.Get()
            .then(con => {
                return con.query(`SELECT department.name Name, department.id DepartmentID FROM department;`)
            })
            .then((rows, err) => {
                return rows[0];
            });
    }

    static async NewDepartment(db) {
        return await Inquirer.prompt([{
                type: 'input',
                name: 'deptName',
                message: 'What will the new department be named?'
            }])
            .then(async ans => {
                await db.Get()
                    .then(con => {
                        return con.execute(`INSERT INTO employees.department (name) VALUES (?);`, [ans.deptName]);
                    });
            })
            .then(async() => {
                return await this.GetDepartments(db)
            });
    }
}

module.exports = Departments;