import mysql from "mysql";

export const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'batoolkazmi'
});


