const mysql = require('mysql2');

class Initializer {
    static Initialize(db) {
        //this.EnsureSchema(db);
        //this.Seed(db);
    }

    static async EnsureSchema(db) {
        let con = db.Get();

        con.query(`SELECT COUNT(*) AS cnt FROM information_schema.tables WHERE table_name = 'department';`, (err, rows) => {
            if (rows[0].cnt == 0) {
                con.query(`
                CREATE TABLE department (
                    id INTEGER AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(30)
                );
            `)
            }
        });

        con.query(`SELECT COUNT(*) AS cnt FROM information_schema.tables WHERE table_name = 'role';`, (err, rows) => {
            if (rows[0].cnt == 0) {
                con.query(`
                    CREATE TABLE role (
                        id INTEGER AUTO_INCREMENT PRIMARY KEY,
                        title VARCHAR(30),
                        salary DECIMAL,
                        department_id INTEGER,
                        FOREIGN KEY (department_id) REFERENCES department(id)
                    );
                `);
            }
        });

        con.query(`SELECT COUNT(*) AS cnt FROM information_schema.tables WHERE table_name = 'employee';`, (err, rows) => {
            if (rows[0].cnt == 0) {
                con.query(`
                    CREATE TABLE employee (
                        id INTEGER AUTO_INCREMENT PRIMARY KEY,
                        first_name VARCHAR(30),
                        last_name VARCHAR(30),
                        role_id INTEGER,
                        manager_id INTEGER,
                        FOREIGN KEY (role_id) REFERENCES role(id),
                        FOREIGN KEY (manager_id) REFERENCES employee(id)
                    );
                `);
            }
        });
    }

    static Seed(db) {
        this.SeedAction(db, "department", "id", "1", `
            INSERT INTO department (id, name)
            VALUES (1, 'Marketing');
        `);
        this.SeedAction(db, "department", "id", "2", `
            INSERT INTO department (id, name)
            VALUES (2, 'Engineering');
        `);

        this.SeedAction(db, "role", "id", "1", `
            INSERT INTO role (id, title, salary, department_id)
            VALUES (1, 'Manager', 100000, 1);
        `);
        this.SeedAction(db, "role", "id", "1", `
            INSERT INTO role (id, title, salary, department_id)
            VALUES (2, 'Developer', 100000, 2);
        `);

        this.SeedAction(db, "employee", "id", "1", `
            INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
            VALUES (1, 'Mary', 'Smith', 1, NULL);
        `);
        this.SeedAction(db, "employee", "id", "2", `
            INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
            VALUES (2, 'Steve', 'Johnson', 1, 1);
        `);
        this.SeedAction(db, "employee", "id", "3", `
            INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
            VALUES (3, 'Duane', 'Abdul', 1, 1);
        `);
    }

    static SeedAction(db, table, filterColumn, filterValue, insertStatement) {
        let con = db.Get();
        con.query(`SELECT COUNT(*) AS cnt FROM employees.${table} WHERE ${filterColumn} = '${filterValue}';`, (err, results) => {
            if (results[0].cnt == 0) {
                //con.query(insertStatement);
            }
        });
    }
}


module.exports = Initializer;