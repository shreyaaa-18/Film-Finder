import mysql from 'mysql2';

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'shreya@123',
    database: 'film_finder',
});

db.connect(err => {
    if (err) {
        console.log('Database connection failed', err);
    } else {
        console.log('Connected to MySQL');
    }
});

export default db;