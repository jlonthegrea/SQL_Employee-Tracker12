const mysql = require('mysql2');
const inquirer = require('inquirer');
const c = require('console.table');
require('dotenv').config()

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "Pridge20?",
    database: 'employee_db'
});

connection.connect((error) => {
    if (error) {
        console.log("Database connection error!");
    }
    userQuestions();
});

const userQuestions = () => {
    inquirer
        .prompt([
            {
                type: 'rawlist',
                name: 'answer',
                message: "What would you like to do?",
                choices: [
                    "View all departments.",
                    "View all roles.",
                    "View all employees.",
                    "Add a department.",
                    "Add a role.",
                    "Add an employee.",
                    "Update an employee role.",
                    "Exit."
                ]
            }
        ])
        .then((obj) => {
            const { answer } = obj;
            if (answer == "View all departments.") {
                viewDepartments();
            }
            if (answer == "View all roles.") {
                viewRoles();
            }
            if (answer == "View all employees.") {
                viewEmployees();
            }
            if (answer == "Add a department.") {
                addDepartment();
            }
            if (answer == "Add a role.") {
                addRole();
            }
            if (answer == "Add an employee.") {
                addEmployee();
            }
            if (answer == "Update an employee role.") {
                updateRole();
            }
            if (answer == "Exit") {
                process.exit();
            }
        });
};

const viewDepartments = () => {
    const sql = `SELECT department.id AS id, department.name AS department FROM department`;
    connection.promise().query(sql)
        .then((rows) => {
            console.table(rows[0])
            userQuestions();
        })
        .catch((err) => {
            console.error(err);
        });
};

const viewRoles = () => {
    const sql = `SELECT role.id, role.title, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id`;
    connection.promise().query(sql)
        .then((rows) => {
            console.table(rows[0])
            userQuestions();
        })
        .catch((err) => {
            console.error(err);
        })
};

const viewEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id`;
    connection.promise().query(sql)
        .then((rows) => {
            console.table(rows[0])
            userQuestions();
        })
        .catch((err) => {
            console.error(err);
        })
};

const addDepartment = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'addedDEPT',
                message: "Please input the department name you would like to add:",
                validate: addedDEPT => {
                    if (addedDEPT) {
                        return true;
                    } else {
                        console.log('Please enter a department name!');
                        return false;
                    }
                }
            }
        ])
        .then((obj) => {
            const { addedDEPT } = obj;
            const sql = `INSERT INTO department (name) VALUES (?)`;
            connection.query(sql, addedDEPT, (err, result) => {
                if (err) throw err;
                console.log('Added' + addedDEPT + ' to departments!');
                viewDepartments();
                userQuestions();
            });
        });
};

const addRole = () => {
    let roleTitle;
    let salary;
    let array = [];

    connection.query(`SELECT * FROM department`, (err, results) => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'role',
                message: "Please input the role you would like to add: ",
                validate: roleInput => {
                    if (roleInput) {
                        return true;
                    } else {
                        console.log('Please add a role.');
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'salary',
                message: "Please input the salary for this role: ",
                validate: salaryInput => {
                    if (salaryInput) {
                        return true;
                    } else {
                        console.log('Please add a salary amount.');
                        return false;
                    }
                }
            },
            {
                type: 'list',
                name: 'department',
                message: "Please select which department this role belongs to: ",
                choices: () => {
                    var array = [];
                    for (var i = 0; i < results.length; i++) {
                        array.push(results[i].name);
                    }
                    return array;
                }
            }
        ]).then((answers) => {
            for (var i = 0; i < results.length; i++) {
                if (results[i].name === answers.department) {
                    var department = results[i];
                }
            }
            connection.query(`INSERT INTO role (title,salary,department_id) VALUES (?, ?, ?)`, [answers.role, answers.salary, department.id], (err, results) => {
                if (err) throw err;
                console.log(`Added ${answers.role} to the database.`)
                userQuestions();
            });
        })
    });
};     

const addEmployee = () => {
    let firstName;
    let lastName;
    let roleId;
    let managerId;
    let array = [];
    connection.query(`SELECT * FROM employee, role`, (err, results) => {
        if (err) throw err;

        inquirer.prompt([
            {
                type: 'input',
                name: 'fN',
                message: "Please input the employee's first name: ",
            },
            {
                type: 'input',
                name: 'lN',
                message: "Please input the employee's last name: "
            },
            {
                type: 'list',
                name: 'role',
                message: "What is this employee's role? ",
                choices: () => {
                    for (var i = 0; i < results.length; i++) {
                        array.push(results[i].title);
                    }
                    var newArray = [...new Set(array)];
                    return newArray;
                },
            },
            {
                type: 'input',
                name: 'manager',
                message: "Please indiacte which manager id this employee is under: ",
            },
        ]).then((answers) => {
            for (var i = 0; i < results.length; i++) {
                if (results[i].title === answers.role) {
                    var role = results[i];
                }
            }
            connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUE (?, ?, ?, ?)`, [answers.fN, answers.lN, role.id, answers.manger_id], (err, results) => {
                if (err) throw err;
                console.log(`Added ${answers.fN} ${answers.lN} to the datadbase.`)
                userQuestions();
            });
        })
    });
};

const updateRole = () => {
    let array = [];
    connection.query(`SELECT * FROM employee, role`, (err, results) => {
        if (err) throw err;

        inquirer.prompt([
            {
                type: "list",
                name: "employee",
                message: "Please choose which employee to update: ",
                choices: () => {
                    var array = [];
                    for (var i = 0; i < results.length; i++) {
                        array.push(results[i].last_name);
                    }
                    var employeeArray = [...new Set(array)];
                    return employeeArray;
                }
            },
            {
                type: "list",
                name: "role",
                message: "What is this employee's new role? ",
                choices: () => {
                    var array = [];
                    for (var i = 0; i < results.length; i++) {
                        array.push(results[i].title);
                    }
                    var newArray = [...new Set(array)];
                    return newArray;
                }
            }
        ]).then((answers) => {
            for (var i = 0; i < results.length; i++) {
                if (results[i].last_name === answers.employee) {
                    var name = results[i];
                }
            }
            for (var i = 0; i < results.length; i++) {
                if (results[i].title === answers.role) {
                    var role = results[i];
                }
            }
            connection.query(`UPDATE employee SET ? WHERE ?`, [{ role_id: role }, { last_name: name }], (err, results) => {
                if (err) throw err;
                console.log(`Updated ${answers.employee} role to the database.`)
                userQuestions();
            });
        })
    });
};







