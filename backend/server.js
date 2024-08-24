import config from "../config";
const express = require("express");
const mysql = require('mysql');
const cors = require("cors");


const app = express();
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: config.USER_NAME,
    password: config.USER_PASSWORD, 
    database: config.DATABASE_NAME
})

app.post('/signup', (req, res) => {
    const sql = "INSERT INTO 3430_users ('name', 'email') VALUES (?)";
    const values = [
        req.body.name,
        req.body.username, 
        req.body.password
    ]
    db.query(sql, [values], (err, data) => {
        if(err){
            return res.json("error");
        }
        return res.json(data);
    }) 
})