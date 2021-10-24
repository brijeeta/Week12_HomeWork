const sequelize = require('../config/connection');
const seedDepartment = require('./DepartmentData');
const seedEmployee = require('./EmployeeData');
const seedRole = require('./RoleData');

const seedAll = async() => {
    await sequelize.sync({ force: true });

    await seedDepartment();

    await seedEmployee();
    await seedRole();

    process.exit(0);
};

seedAll();