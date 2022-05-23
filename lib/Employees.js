const Inquirer = require('inquirer');

class Employees {
    constructor() {}

    static async GetEmployees(db) {
        return await db.Get()
            .then(con => {
                return con.query(`SELECT e.id Id, e.first_name FirstName, e.last_name LastName, r.title Title, d.name DepartmentName, r.salary Salary, m.id ManagerId, m.first_name ManagerFirstName, m.last_name ManagerLastName
                FROM employee e 
                    LEFT JOIN role r on e.role_id = r.id
                    LEFT JOIN department d ON r.department_id = d.id
                    LEFT JOIN employee m ON e.manager_id = m.id;`)
            })
            .then((rows, err) => {
                return rows[0];
            });
    }

    static async NewEmployee(db) {
        let roles = await db.Get()
            .then(con => {
                return con.query('SELECT r.title name, r.id value FROM role r ORDER BY name ASC;')
            })
            .then((rows, err) => {
                return rows[0];
            });

        let managers = await db.Get()
            .then(con => {
                return con.query(`SELECT CONCAT(e.first_name, ' ', e.last_name) name, e.id value FROM employee e ORDER BY e.last_name ASC;`);
            })
            .then((rows, err) => {
                return rows[0];
            });

        if (managers.length == 0) {
            managers.push({ name: "(No managers available, blank for now", value: "NULL" });
        } else {
            managers.push({ name: "(No Manager)", value: "NULL" });
        }

        return await Inquirer.prompt([{
                type: 'input',
                name: 'empFName',
                message: 'What is the new employee\'s first name?'
            }, {
                type: 'input',
                name: 'empLName',
                message: 'What is the new employee\'s last name?'
            }, {
                type: 'list',
                name: 'roleId',
                message: 'What role will the new employee be in?',
                choices: roles
            }, {
                type: 'list',
                name: 'mgrId',
                message: 'Who will the new employee\'s manager be?',
                choices: managers
            }])
            .then(async ans => {
                return db.Get()
                    .then(async con => {
                        if (ans.mgrId === 'NULL') {
                            await con.execute(`INSERT INTO employees.employee (first_name, last_name, role_id) VALUES (?, ?, ?);`, [ans.empFName, ans.empLName, ans.roleId]);
                        } else {
                            await con.execute(`INSERT INTO employees.employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`, [ans.empFName, ans.empLName, ans.roleId, ans.mgrId]);
                        }
                    });
            })
            .then(() => {
                return this.GetEmployees(db);
            });
    }

    static async UpdateEmployee(db) {
        let emps = await db.Get()
            .then(con => {
                return con.query(`SELECT CONCAT(e.first_name, ' ', e.last_name) name, e.id value FROM employee e ORDER BY e.last_name ASC;`)
            })
            .then((rows, err) => {
                return rows[0];
            });

        let roles = await db.Get()
            .then(con => {
                return con.query(`SELECT r.title name, r.id value FROM role r ORDER BY r.title ASC;`)
            })
            .then((rows, err) => {
                return rows[0];
            });

        return await Inquirer.prompt([{
                    type: 'list',
                    name: 'empId',
                    message: 'Which employee would you like to update?',
                    choices: emps
                },
                {
                    type: 'list',
                    name: 'roleId',
                    message: 'What is this employee\'s new role?',
                    choices: roles
                }
            ])
            .then(async ans => {
                return db.Get()
                    .then(async con => {
                        await con.execute(`UPDATE employee SET role_id = ? WHERE id = ?;`, [ans.roleId, ans.empId]);
                    });
            })
            .then(() => {
                return this.GetEmployees(db);
            });
    }
}

module.exports = Employees;