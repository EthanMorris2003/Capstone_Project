const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt'); // For password hashing
require('dotenv').config(); // Load environment variables from .env file


const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER || 'root', // Replace with your MySQL username
  password: process.env.DB_PASSWORD || '', // Replace with your MySQL password
  database: 'capstone' // Replace with your database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL databaste');
});

// Environment variable for encryption key
const secretKey = process.env.MYSQL_ENCRYPTION_KEY || 'default_secret_key'; //REPLACE WITH KEY

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

//Sign up Function
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await hashPassword(password);

    const query = 'INSERT INTO user_info (username, password) VALUES (?, AES_ENCRYPT(?, ?))';
    db.query(query, [username, hashedPassword, secretKey], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        res.status(500).send('Error signing up');
        return;
      }
      res.status(200).send('User signed up successfully');
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).send('Error signing up');
  }
});


//Login Function
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = 'SELECT userId, AES_DECRYPT(password, ?) AS decryptedPassword FROM user_info WHERE username = ?';
    db.query(query, [secretKey, username], async (err, result) => {
      if (err) {
        console.error('Error retrieving user:', err);
        res.status(500).send('Error logging in');
        return;
      }

      if (result.length > 0) {
        const user = result[0];
        const decryptedPassword = user.decryptedPassword.toString();
        const isMatch = await bcrypt.compare(password, decryptedPassword);
        if (isMatch) {
          res.status(200).send('User signed in successfully');
        } else {
          res.status(401).send('Invalid username or password');
        }
      } else {
        res.status(404).send('User not found');
      }
    });
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).send('Error logging in');
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});