const { Department } = require('../models');

const departmentdata = [{

        name: 'Sales',
    },
    {

        name: 'Marketing',
    },
    {

        name: 'Engineering',
    },
    {

        name: 'Finance',
    },
    {

        name: 'Legal',
    },
];

const seedDepartment = () => Department.bulkCreate(departmentdata);

module.exports = seedDepartment;