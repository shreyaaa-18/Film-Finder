{/* require("dotenv").config();
const mysql = require("mysql2");

const urlDB = `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`

const connection = mysql.createConnection(urlDB);

module.exports = connection; */}

//require("dotenv").config();
import mysql from 'mysql2/promise'

let connection;

export const connectToDatabase = async () => {
    if(!connection || reconnect) {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        })
    }
    return connection
} 