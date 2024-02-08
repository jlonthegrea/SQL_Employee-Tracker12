const mysql = require('mysql2');
const inquirer = require('inquirer');
const c = require('console.table');
require('dotenv').config()

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "Genesis23?",
    database: 'employee_db'
});

connection.connect((error) => {
    if(error) {
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