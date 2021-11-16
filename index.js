const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rua123',
    database: 'company_db'
    });

db.connect((err) => {
    if (err) throw err;
    console.log('*** Connected to Company Employee Database ***');
    main();
});

function main() {
    inquirer
    .prompt([
        {
            type: 'list',
            name: 'main',
            message: 'What would you like to do?',
            choices: [
            'View Departments',
            'Add Department',
            'View Roles',
            'Add Role',
            'View Employees',
            'Add Employee',
            'Exit',
            ]
        }
    ])
    .then((response) => {
        console.log(response);
            switch (response.main) {
              case 'View Departments':
                viewDep();
                break;
              case 'View Employees':
                viewEmp();
                break;
              case 'View Roles':
                viewRoles();
                break;
              case 'Add Department':
                addDep();
                break;
              case 'Add Role':
                addRoles();
                break;
              case 'Add Employee':
                addEmp();
                break;
              case 'Exit':
                db.end();
                break;
            }
    });
};

function viewDep() {
    db.query("SELECT * FROM department", (err, result) => {
        if (err) throw err;
        console.table(result);
        main();
    });
};

function addDep() {
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'addDep',
            message: 'Enter name of departmant you want to add',
        }
    ])
    .then ((input) => {
        let depName = input.addDep;
        let qry = `INSERT INTO department (department_name) VALUES ('${depName}')`;
        db.query(qry, (err, result) => {
            if (err) throw err;
            console.table(result);
            main();
        })
    });
};