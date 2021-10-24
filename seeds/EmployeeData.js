const { Employee } = require('../models');

const employeedata = [{

        firstName: 'Holy',
        lastName: 'Jaison',
        roleId: 60,
        managerId: 3433,
    },
    {

        firstName: 'Sweety',
        lastName: 'Jose',
        roleId: 61,
        managerId: 1234,
    },
    {

        firstName: 'Meety',
        lastName: 'Benny',
        roleId: 62,
        managerId: 4566,
    },
    {

        firstName: 'Rosily',
        lastName: 'Paul',
        roleId: 63,
        managerId: 6675,
    },
    {

        firstName: 'Honey',
        lastName: 'Reney',
        roleId: 64,
        managerId: 6678,
    },
];

const seedEmployee = () => Employee.bulkCreate(employeedata);

module.exports = seedEmployee;