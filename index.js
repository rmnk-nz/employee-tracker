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
            'Update Employee Role',
            'Exit',
            ]
        }
    ])
    .then((response) => {
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
                case 'Update Employee Role':
                updateEmp();
                break;
              case 'Exit':
                console.log('Leaving Company Database');
                db.end();
                break;
            }
    });
};

function viewDep() {
    db.query('SELECT * FROM department', (err, result) => {
        if (err) throw err;
        console.table(result);
        main();
    });
};

function viewEmp() {
    db.query('SELECT * FROM employee', (err, result) => {
        if (err) throw err;
        console.table(result);
        main();
    });
};

function viewRoles() {
    db.query('SELECT * FROM roles', (err, result) => {
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
            name: 'department',
            message: 'Enter name of departmant you want to add',
        }
    ])
    .then ((response) => {
        db.query(`INSERT INTO department (department_name) VALUES ('${response.department}')`, (err, result) => {
            if (err) throw err;
            console.log('Succesfully added new department to Company Database');
            main();
        })
    });
};

function addRoles() {
    let departments = [];

    db.query('SELECT * FROM department', (err, result) => {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            departments.push(result[i].department_name)
        } return departments
    });

    inquirer
    .prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter title of new role',
        },
        {
            type: 'input',
            name: 'salary',
            message: " Enter salary for new role",
        },
        {
            type: 'list',
            name: 'roleDepartment',
            message: 'Associate new role to a Department',
            choices: departments,
        }
    ])
    .then((response) => {
        let departmentID = departments.indexOf(response.roleDepartment) +1;

        db.query(`INSERT INTO roles (title, salary, department_id) VALUES('${response.title}', '${response.salary}', '${departmentID}')`, (err, result) => {
            if (err) throw err;
            console.log('Successfully added new role to Comapny Database');
            main();
        });
    });
};

function addEmp() {
    let roles = [];
    let managers = ['Not Applicable']; 

    db.query('SELECT * FROM roles', (err, result) => {
        if (err) throw err;
        for(let i = 0; i < result.length; i++) {
        roles.push(result[i].title)
        } return roles;
    });

    db.query('SELECT * FROM employee', (err, result) => {
        if (err) throw err;
        for(let i = 0; i < result.length; i++) {
        managers.push(result[i].first_name)
        } return managers
    });
    
    inquirer
     .prompt([
        {
            type: 'input',
            name: 'firstname',
            message: 'Enter employees first name'
        },
        {
            type: 'input',
            name: 'lastname',
            message: 'Enter employee last name'  
        },
        {
            type: 'list',
            name: 'employeeRole',
            message: 'Select new employees role',
            choices: roles,
        },
        {
            type: 'list',
            name: 'employeeManager',
            message: 'Select manager of employee if applicable',
            choices: managers,
        }
               
    ])
    .then ((response) => {
        let roleID = roles.indexOf(response.employeeRole) +1;
        let managerID = managers.indexOf(response.employeeManager) + 1;
        
        if (response.employeeManager === 'Not Applicable') {
                    db.query(`INSERT INTO employee(first_name, Last_name, roles_id) VALUES('${response.firstname}', '${response.lastname}', '${roleID}')`, (err, result) => {
                    if (err) throw err;
                    console.log('Successfully added new employee to Comapny Database');
                    main();
                });                
            } 
            else {
                db.query(`INSERT INTO employee(first_name, Last_name, roles_id, manager_id) VALUES('${response.firstname}', '${response.lastname}', '${roleID}', '${managerID}')`, (err, result) => {
                if (err) throw err;
                console.log('Successfully added new employee to Comapny Database');
                main();
                });
            }
    });
};

function updateEmp() {
    let companyEmployee = [];
    let companyRole = [];

    db.query('SELECT * FROM employee', (err, result) => {
        if (err) throw err;
        for(let i = 0; i < result.length; i++) {
        companyEmployee.push(result[i].first_name + ' ' + result[i].last_name)
        } return companyEmployee
    });
   
    db.query('SELECT * FROM roles', (err, result) => {
        if (err) throw err;
        for(let i = 0; i < result.length; i++) {
        companyRole.push(result[i].title)
        } return companyRole
    });

    inquirer
    .prompt ([
        {
            type: 'list',
            name: 'init',
            message: 'Upadte employee role?',
            choices: ['YES', 'NO']
        },
        {
            type: 'list',
            name: 'employee',
            message: 'Select employeee',
            choices: companyEmployee,
        },
        {
        type: 'list',
        name: 'newRole',
        message: 'Select role',
        choices: companyRole,
        }
    ])
    .then ((response) => {
        if (response.init === "YES") {
            let empID = companyEmployee.indexOf(response.employee) + 1;
            let roleID = companyRole.indexOf(response.role) + 1;
            db.query(`UPDATE employee SET roles_id = '${roleID}' WHERE id = '${empID}'`, (err, result) => {
                if (err) throw err;
                console.log('Succesfully updated employee role');
                main();
            })
        } else {
            main();
        };
    });
};