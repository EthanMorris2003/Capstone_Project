require('dotenv').config({ path: './.env' });

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const secureCompare = require('secure-compare');
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken');

require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL:', error);
    return;
  }
  console.log('Connected to MySQL databaste');
});

// Environment variable for encryption key
const secretKey = process.env.MYSQL_ENCRYPTION_KEY;
const jwtKey = process.env.JWT_KEY;

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
    db.query(query, [username, password, secretKey], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        res.status(500).send('Error signing up');
        return;
      }
      res.status(200).send('User signed up successfully');
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).send('Username already exists');
    }
    console.error('Error hashing password:', error);
    res.status(500).send('Error signing up');
  }
});


//Login Function
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = 'SELECT userId, username, AES_DECRYPT(password, ?) AS decryptedPassword FROM user_info WHERE username = ?';
    db.query(query, [secretKey, username], async (err, result) => {
      if (err) {
        console.error('Error retrieving user:', err);
        res.status(500).send('Error logging in');
        return;
      }

      if (result.length > 0) {
        const user = result[0];
        let decryptedPassword = user.decryptedPassword;

        if (Buffer.isBuffer(decryptedPassword)) {
          decryptedPassword = decryptedPassword.toString('utf8');
        }

        const isMatch = secureCompare(password, decryptedPassword);
        if (isMatch) {
          const token = jwt.sign({
            username: user.username
          }, jwtKey, {
            expiresIn: '30m'
          });

          return res.status(200).send({
            message: 'User authenticated successfully',
            token: token
          });
        } else {
          res.status(401).send('Invalid username or password');
        }
      } else {
        res.status(404).send('User not found');
      }
    });
  } catch (error) {
    res.status(500).send('Error logging in: ', error);
  }
});

app.post('/add_note', async (req, res) => {
  const {noteId, username, noteTitle, noteContent } = req.body;

  if (!username) {
    res.status(400).send('No user information found. Please log in');
    return;
  }

  try {
    // If there is a note selected => modify
    if (noteId != null) {
      const modifyNoteQuery = 
      `
      UPDATE note
      SET name = ?, description = ?
      WHERE noteId = ?
      `

      db.query(modifyNoteQuery, [noteTitle, noteContent, noteId], (errModifyNote, resultModifyNote) => {

        if (errModifyNote) {
          console.error('Error updating note:', errModifyNote);
          res.status(500).send('Error updating note');
          return;
        }

        if (resultModifyNote.affectedRows === 0) {
          return res.status(404).send('Note not found');
        }

        res.status(200).send("Note modified successfully");
      });

    } 
    // If it's a brand new note => add
    else {
      const addNoteQuery = "INSERT INTO note (name, description) VALUES (?, ?)";

      db.query(addNoteQuery, [noteTitle, noteContent], (errAddNote, resultAddNote) => {

        if (errAddNote) {
          console.error('Error adding note:', errAddNote);
          res.status(500).send('Error adding note');
          return;
        }

        const newnoteId = resultAddNote.insertId;

        const addRelationQuery =
          `
        INSERT INTO user_note (userId, noteId)
        SELECT ui.userId, n.noteId
        FROM user_info AS ui
        JOIN note n ON n.noteId = ?
        WHERE ui.username = ?
      `

        db.query(addRelationQuery, [newnoteId, username], (errAddRelation, resultAddRelation) => {
          if (errAddRelation) {
            console.error('Error adding relationship:', errAddRelation);
            res.status(500).send('Error adding relationship');
            return;
          }
        });

        res.status(201).send("Note added successfully");
      });
    }

  } catch (error) {
    res.status(500).send('Error adding note: ', error);
  }
});

app.get('/get_note', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    res.status(400).send('No user information found. Please log in');
    return;
  }

  try {
    const getNoteQuery =
      `SELECT n.noteId, n.name, n.description FROM note as n
      JOIN user_note AS un ON n.noteId = un.noteId
      WHERE un.userId = (
	    SELECT userId from user_info
      WHERE username = ?
      )`

    db.query(getNoteQuery, [username], (errGetNote, getNoteResult) => {
      if (errGetNote) {
        console.error('Error retrieving notes:', errGetNote);
        res.status(500).send('Error retrieving notes');
        return;
      }

      return res.status(200).send({
        data: getNoteResult
      });
    });

  } catch (error) {
    res.status(500).send('Error retrieving notes: ', error);
  }
});

app.post('/delete_note', async (req, res) => {
  const { noteId } = req.body;

  // ON DELETE CASCADE is in place to delete user_note relation when a note is deleted.
  try {
    const deleteNoteQuery =
      `DELETE FROM note WHERE noteId = ?`

    db.query(deleteNoteQuery, [noteId], (errDeleteNote, deleteNoteResult) => {
      if (errDeleteNote) {
        console.error('Error retrieving notes:', errDeleteNote);
        res.status(500).send('Error retrieving notes');
        return;
      }

      if (deleteNoteResult.affectedRows === 0) {
        return res.status(404).send('Note not found');
      }

      res.status(201).send("Note deleted successfully");
    });
  }
  catch (error) {
    res.status(500).send('Error deleting note: ', error);
  }

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});