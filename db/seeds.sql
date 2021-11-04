-- Department data
INSERT INTO departments (dept_name)
VALUES
("Sales"),
("Engineering"),
("Finance"),
("HR"),
("Marketing");

INSERT INTO roles (title, salary, dept_id)
VALUES
("Sales Lead", 100000, 1),
("Salesperson", 80000, 1),
("Lead Engineer", 150000, 2),
("Software Engineer", 110000, 2),
("Account Manager", 140000, 3),
("Accountant", 70000, 3),
("HR intern", 200000, 4),
("senior recruiter", 65000, 4),
("Marketing Head", 60000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
("Sweety", "Benny", 1, NULL),
("Meety", "Jose", 2, 1),
("Honey", "Reney", 9, NULL),
("Rosily", "Paul", 3, NULL),
("Paul", "Kate", 4, 4);