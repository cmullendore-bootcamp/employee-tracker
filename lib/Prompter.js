const Inquirer = require('inquirer');
const Roles = require("./Roles");
const Departments = require("./Departments");
const Employees = require("./Employees");
const cTable = require("console.table");

class Prompter {
    constructor(db) {
        this.DB = db;
        this.Continue = true;
    }

    async Start() {
        while (this.Continue) {

            await Inquirer.prompt({
                    type: 'rawlist',
                    name: 'nextAction',
                    message: 'What would you like to do next?',
                    choices: [
                        'View all Departments',
                        'View all Roles',
                        'View all Employees',
                        'Add a Department',
                        'Add a Role',
                        'Add an Employee',
                        'Update an Employee Role',
                        'Exit'
                    ]
                })
                .then(async ans => {
                    switch (ans.nextAction) {
                        case "View all Departments":
                            console.table(await Departments.GetDepartments(this.DB));
                            break;
                        case "Add a Department":
                            console.table(await Departments.NewDepartment(this.DB));
                            break;
                        case "View all Roles":
                            console.table(await Roles.GetRoles(this.DB));
                            break;
                        case "Add a Role":
                            console.table(await Roles.NewRole(this.DB));
                            break;
                        case "View all Employees":
                            console.table(await Employees.GetEmployees(this.DB));
                            break;
                        case "Add an Employee":
                            console.table(await Employees.NewEmployee(this.DB));
                            break;
                        case "Update an Employee Role":
                            console.table(await Employees.UpdateEmployee(this.DB));
                            break;
                        case "Exit":
                            console.log("Thanks and Goodbye");
                            process.exit();
                            break;
                        default:
                            console.log("A valid choice was not selected. Try again.");
                            break;
                    }
                });
        }
    }

}

module.exports = Prompter;