 require('console.table');
 const inquirer = require('inquirer')
 const connection = require('./config/connection');
 const chalk = require('chalk');


 connection.connect((error) => {
     if (error) throw error;
     console.log(`
    _____________________________________________________________
    |                                                           |
    |      _ _ _ _                 _                            |
    |     |  _ _ _|_ __ ___  _ __ | | ___  _   _  ___  ___      |
    |     |    _| | \'_ \` _ \\| \'_ \\| |/ _ \\| | | |/ _ \\/ _ \\     |
    |     |   |_ _| | | | | | |_) | | (_) | |_| |  __/  __/     |
    |     |_ _ _ _|_| |_| |_| \.__/|_|\\___/\\__,  |\\___|\\___|     |
    |                       |_|            |___/                |
    |      ___  ___                                             |
    |     |   \\/   | __ _ _ __   __ _  __ _  ___ _ __           |
    |     |  |\\/|  |/ _\` | \'_ \\ / _\` |/ _\` |/ _ \\ \'__|          |
    |     |  |  |  | (_| | | | | (_| | (_| |  __/ |             |
    |     |__|  |__|\\__,_|_| |_|\\__,_|\\__, |\\___|_|             |
    |                                  |___/                    |
    |                                                           |
    |___________________________________________________________|
        `);
     console.log('Welcome to the Employee Manager System!');
     promptUser();
 });


 // initialize app
 const promptUser = () => {
     // prompt user for first choice
     inquirer.prompt({
             type: 'list',
             name: 'prompt',
             message: 'What would you like to do?',
             choices: [
                 'View All Employees',
                 'View All Roles',
                 'View All Departments',
                 'Add Employee',
                 'Add Role',
                 'Add Department',
                 'Update Employee Role',
                 'Exit'
             ]
         })
         // call appropriate function based on user selection
         .then((response) => {
             const option = response.prompt

             if (option === 'View All Departments') {
                 viewAllDepartments()

             } else if (option === 'View All Roles') {
                 viewAllRoles()

             } else if (option === 'View All Employees') {
                 viewAllEmployees()

             } else if (option === 'Add Department') {
                 addDepartment()

             } else if (option === 'Add Role') {
                 addRole()

             } else if (option === 'Add Employee') {
                 addEmployee()

             } else if (option === 'Update Employee Role') {
                 updateEmployeeRole()


             } else if (option === 'Exit') {
                 console.log('Thanks for using Employee Management System.Goodbye!')
                 connection.end()
                 process.exit()
             }
         })

 }

 // view all departments
 const viewAllDepartments = () => {

     const sql = `SELECT dept_id AS DepartmentID,dept_name AS DepartmentName FROM departments ORDER BY dept_id ASC;`

     connection.query(sql, (err, res) => {
         if (err) throw err
         console.log(chalk.yellow.bold(`====================================================================================`));
         console.log(`                                ` + chalk.green.bold(`All Departments:`));
         console.log(chalk.yellow.bold(`====================================================================================`));
         console.table(res);
         promptUser();
     })
 }

 // view all roles
 const viewAllRoles = () => {
     const sql = `SELECT role_id AS RoleID,title AS Title,salary AS Salary,dept_name AS DepartmentName FROM roles 
    INNER JOIN departments
    ON roles.dept_id = departments.dept_id ORDER BY role_id ASC;`

     connection.query(sql, (err, res) => {
         if (err) throw err
         console.log(chalk.yellow.bold(`====================================================================================`));
         console.log(`                                ` + chalk.green.bold(`All Roles:`));
         console.log(chalk.yellow.bold(`====================================================================================`));
         console.table(res);
         promptUser();
     })
 }

 // view all employees
 const viewAllEmployees = () => {
     const sql = `SELECT emp_id AS EmployeeID,first_name AS FirstName,last_name AS LastName,
    title AS Title,dept_name AS DepartmentName,salary AS Salary,manager_id AS ManagerID  
    FROM employees 
    LEFT JOIN roles ON employees.role_id = roles.role_id
    LEFT JOIN departments ON roles.dept_id = departments.dept_id ORDER BY emp_id ASC;`

     connection.query(sql, (err, res) => {
         if (err) throw err
         console.log(chalk.yellow.bold(`====================================================================================`));
         console.log(`                                ` + chalk.green.bold(`All Employees:`));
         console.log(chalk.yellow.bold(`====================================================================================`));
         console.table(res);
         promptUser();
     })
 }

 // add a department
 const addDepartment = () => {
     inquirer.prompt({

         // Prompt user for name of department
         name: "deptName",
         type: "input",
         message: "Department Name: "
     }).then((answer) => {
         const newDept = answer.deptName
         const sql = `INSERT INTO departments (dept_name) VALUES ("${newDept}");`
             // add department to the table
         connection.query(sql, (err, res) => {
             if (err) return err;
             console.log("\n DEPARTMENT ADDED...\n ");
             promptUser();
         });

     });
 }

 // add a role
 const addRole = () => {

     // Create array of departments
     let departmentArr = [];

     getDeptSql = `SELECT dept_id,dept_name FROM departments ORDER BY dept_name ASC`
     connection.query(getDeptSql, (err, res) => {
         if (err) throw err
         for (let i = 0; i < res.length; i++) {
             departmentArr.push(res[i].dept_name)
         }
         return departmentArr

     })

     inquirer.prompt([{
             // Prompt user role title
             name: "roleTitle",
             type: "input",
             message: "Role title: "
         },
         {
             // Prompt user for salary
             name: "salary",
             type: "number",
             message: "Salary: "
         },
         {
             // Prompt user to select department role
             name: "dept",
             type: "list",
             message: "Department: ",
             choices: departmentArr
         }
     ]).then((answer) => {

         const roleName = answer.roleTitle
         const newSalary = answer.salary
         const newRoleDept = answer.dept

         const getDeptIDSql = `SELECT dept_id FROM departments WHERE dept_name = '${newRoleDept}'`

         const addRoleSql = `
                INSERT INTO roles (title, salary, dept_id)
                VALUES ("${roleName}", ${newSalary}, (${getDeptIDSql}));`

         connection.query(addRoleSql, (err, res) => {
             if (err) throw err
             console.log(`\n ROLE ${roleName} ADDED...\n`);
             promptUser();
         })

     });

 }

 // Function for ADDING A NEW EMPLOYEE
 const addEmployee = () => {

     // Create three global array to hold 
     let roleArr = [];
     let managerArr = [];

     getRolesSql = `SELECT role_id,title FROM roles ORDER BY title ASC`
     connection.query(getRolesSql, (err, res) => {
         if (err) throw err
         for (let i = 0; i < res.length; i++) {
             roleArr.push(res[i].title)
         }
         return roleArr

     })

     getManagerSql = `SELECT employees.emp_id, concat(employees.first_name, ' ' ,  employees.last_name)
     AS Employee FROM employees ORDER BY Employee ASC`
     connection.query(getManagerSql, (err, res) => {
         if (err) throw err
         for (let i = 0; i < res.length; i++) {
             managerArr.push(res[i].Employee)
         }
         return managerArr

     })

     // add option for no manager
     managerArr.unshift('--');
     // Inquirer prompts
     inquirer.prompt([{
                 type: 'input',
                 message: `What is the employee's first name?`,
                 name: 'firstName',
                 validate: (input) => {
                     if (input === "") {
                         console.log("**Please enter first name**");
                         return false;
                     } else {
                         return true;
                     }
                 }
             },
             {
                 type: 'input',
                 message: `What is the employee's last name?`,
                 name: 'lastName',
                 validate: (input) => {
                     if (input === "") {
                         console.log("**Please enter last name**");
                         return false;
                     } else {
                         return true;
                     }
                 }
             },
             {
                 // Prompt user of their role
                 name: "role",
                 type: "list",
                 message: "What is their role?",
                 choices: roleArr
             }, {
                 // Prompt user for manager
                 name: "manager",
                 type: "list",
                 message: "Who is their manager?",
                 choices: managerArr
             }
         ])
         .then((response) => {
             const firstName = response.firstName
             const lastName = response.lastName
             const newEmpRole = response.role
             const newEmpMgr = response.manager

             const getRoleID = `SELECT role_id FROM roles WHERE title = '${newEmpRole}'`

             // This is the path if the user selects "--" for a manager
             if (newEmpMgr === '--') {
                 // add employee query
                 const addEmpQuery = `
                    INSERT INTO employees (first_name, last_name, role_id, manager_id)
                    VALUES ("${firstName}", "${lastName}", (${getRoleID}), Null);`


                 connection.query(addEmpQuery, (err) => {
                     if (err) throw err
                         // Confirm employee has been added
                     console.log(`\n EMPLOYEE ${firstName} ${lastName} ADDED With no manager...\n `);
                     promptUser();
                 })

                 // This is the path if the user selects someone as a manager
             } else {

                 // get employee id
                 connection.query(`SELECT emp_id FROM employees WHERE CONCAT(first_name, " ",last_name) = '${newEmpMgr}'`, (err, row) => {
                     if (err) throw err


                     // Result from the query to get the employee ID of the manager
                     const mgrID = row[0].emp_id

                     // Insert employee
                     const addEmpQuery = `
                        INSERT INTO employees (first_name, last_name, role_id, manager_id)
                        VALUES ("${firstName}", "${lastName}", (${getRoleID}), (${mgrID}));`


                     connection.query(addEmpQuery, (err) => {
                         if (err) throw err
                         console.log(`\n EMPLOYEE ${firstName} ${lastName} ADDED with manager...\n `);
                         promptUser();
                     })
                 })
             }
         })
 }



 // update employee role
 const updateEmployeeRole = () => {

     let employeeArr = [];
     // get the employees
     getEmployeeSql = `SELECT employees.emp_id, concat(employees.first_name, ' ' ,  employees.last_name) AS Employee FROM employees ORDER BY Employee ASC`
     connection.query(getEmployeeSql, (err, res) => {
             if (err) throw err
             for (i = 0; i < res.length; i++) {
                 employeeArr.push(res[i].Employee);
             }

             return employeeArr
         })
         // get the roles
     let roleArray = [];
     getRolesSql = `SELECT role_id,title FROM roles ORDER BY title ASC`
     connection.query(getRolesSql, (err, res) => {
         if (err) throw err
         for (i = 0; i < res.length; i++) {
             roleArray.push(res[i].title);
         }

         return roleArray
     })

     // Inquirer Prompt
     inquirer.prompt([{
                 // Prompt user role which needs to change
                 name: "roleTitle",
                 type: "input",
                 message: "Which Role would you like to change ? "
             },
             {
                 type: 'list',
                 message: `Which employee would you like to update?`,
                 name: 'updatedEmployee',
                 choices: employeeArr
             }, {
                 type: 'list',
                 message: `Which role would you like to assign to this employee?`,
                 name: 'updatedRole',
                 choices: roleArray
             }
         ])
         .then((response) => {
             const updatedEmp = response.updatedEmployee
             const updatedRole = response.updatedRole
             const getRoleID = `SELECT role_id FROM roles WHERE title = '${updatedRole}'`
             const updateQuery = `UPDATE employees SET role_id = (${getRoleID}) WHERE CONCAT(employees.first_name," ",employees.last_name) = '${updatedEmp}';`
             connection.query(updateQuery, (err) => {
                 if (err) throw err
                 console.log(`\n ${updatedEmp} ROLE UPDATED TO ${updatedRole}...\n `);
                 promptUser();
             })
         })


 }