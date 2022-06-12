require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

// Create connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionlimit: 10,
});
//check connection
db.connect((err) => {
  if (!err) {
    console.log("DB connection succeeded");
  } else {
    console.log(
      "DB connection failed \n Error : " + JSON.stringify(err, undefined, 2)
    );
  }
});

//get all users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.status(200).send(result);
    }
  });
});

//get user by id

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  db.query(`SELECT * FROM users WHERE id = ${id}`, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.status(200).send(result);
    }
  });
});

//create user

app.post("/users", (req, res) => {
  const { name, age, city } = req.body;
  db.query(
    "INSERT INTO users (name,age, city) VALUES (?, ?, ?)",
    [name, age, city],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        res.status(200).send(result);
      }
    }
  );
});

//Delete user

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.status(200).send(result);
    }
  });
});

//Update user

app.patch("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, age, city } = req.body;
  db.query(
    "UPDATE users SET name = ?, age = ?, city = ? WHERE id = ?",
    [name, age, city, id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        res.status(200).send(result);
      }
    }
  );
});

//start server
app.listen(process.env.APP_PORT, () => {
  console.log(`Server running on port ${process.env.APP_PORT}`);
});
