const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
        host: 'localhost',
        // MySQL username,
        user: process.env.DB_USER,
        // MySQL password
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log(`Connected to the Employee database.`)
);


module.exports = connection;