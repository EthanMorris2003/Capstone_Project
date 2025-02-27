const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: '', // Replace with your MySQL password
  database: 'capstone' // Replace with your database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  const query = 'INSERT INTO user_info (username, password) VALUES (?, ?)';
  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      res.status(500).send('Error signing up');
      return;
    }
    res.status(200).send('User signed up successfully');
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM user_info WHERE EXISTS (username = ? AND password = ?)';
  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error('username and/or password is incorrect:', err);
      res.status(500).send('username and/or password is incorrect');
      return;
    }
    res.status(200).send('User signed in successfully');
  });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});