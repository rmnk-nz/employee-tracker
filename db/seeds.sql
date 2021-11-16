INSERT INTO department (department_name)
VALUES  ("Sales"),
        ("Legal"),
        ("Finance"),
        ("Engineering");

INSERT INTO roles (title, salary, department_id)
VALUES  ("Sales Rep", 80000, 1),
        ("Sales Lead", 100000, 1),
        ("Solicitor", 180000, 2),
        ("Barrister", 200000, 2),
        ("Accountant", 120000, 3),
        ("Account Manager", 150000, 3),
        ("Lead Engineer", 150000, 4),
        ("Software Emginneer", 120000, 4);

INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES  ("John", "Smith", 8, NULL);