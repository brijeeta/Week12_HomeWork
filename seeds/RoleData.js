const { Role } = require('../models');

const roledata = [{

        title: 'Salesperson',
        salary: 40000,
        departmentId: 001
    },
    {

        title: 'Quality Engineer',
        salary: 20000,
        departmentId: 002
    },
    {

        title: 'Front End Developer',
        salary: 120000,
        departmentId: 003
    },
    {

        title: 'Devops Engineer',
        salary: 140000,
        departmentId: 004
    },
    {

        title: 'Product Owner',
        salary: 110000,
        departmentId: 005
    },
];

const seedRole = () => Role.bulkCreate(roledata);

module.exports = seedRole;