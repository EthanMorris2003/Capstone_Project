require('dotenv').config({ path: './.env' });

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const secureCompare = require('secure-compare')

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

console.log(process.env);

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.post('/api/signup', (req, res) => {
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

app.post('/api/login', (req, res) => {
  data = req.body;
  username = data['username'];
  password = data['password'];
  const query = 'SELECT username, password FROM user_info WHERE username = ?';
  db.query(query, username, (err, result) => {
      if (err) return res.send(err)
      else {
          if (result.length === 0) {
              res.status(404).send('Incorrect Username/Password');
              return
          } else if (result.length > 1) {
              res.status(404).send('User already exists.');
              return
          }

          const storedPassword = result[0].password;

          if (!secureCompare(storedPassword, password)) {
              res.status(404).send('Incorrect Username/Password');
              return
          } else {
              res.status(200).send('User authenticated successfully');
              return
          }
      }
  });
});

app.get('/api/test', (req, res) => {
  res.send('This is the test route!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});