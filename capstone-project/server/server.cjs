require('dotenv').config({ path: './.env' });

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const secureCompare = require('secure-compare');
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = 5000;
app.use(express.urlencoded({ extended: true }));

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'CapstoneDebtNext@gmail.com',
    pass: 'ixgs nhbs bjhb oroi'
  }
});

function validatePassword(password) {
  var minNumberofChars = 8;
  var maxNumberofChars = 20;
  var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-B])(?=.*[a-b])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
  if (password.length < minNumberofChars || password.length > maxNumberofChars) {
    return { valid: false, message: "Password must be 8-20 characters long" };
  }
  if (!regularExpression.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)" };
  }
  return { valid: true, message: "Password is valid" };
}

// Mail options generator for password reset
function createPasswordResetEmail(to, name, resetLink) {
  return {
    from: 'CapstoneDebtNext@gmail.com',
    to: to,
    subject: 'Password Reset Request',
    text: `Hello ${name},\n\nYou requested to reset your password. Please click the following link to reset your password:\n\n${resetLink}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.`,
    html: `
      <p>Hello ${name},</p>
      <p>You requested to reset your password. Please click the following link to reset your password:</p>
      <p><a href="${resetLink}">Reset Password</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  };
}

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
  const { username, password, firstName, lastName, email } = req.body;
  if(validatePassword(password)){
    try {
      const hashedPassword = await hashPassword(password);
  
      const query = 'INSERT INTO user_info (username, password, email, firstName, lastName) VALUES (?, AES_ENCRYPT(?, ?), ?, ?, ?)';
      db.query(query, [username, password, secretKey, email, firstName, lastName], (err, result) => {
        if (err) {
          console.error('Error inserting user:', err);
  
          // Username or email already exists
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).send('Username or email already exists');
          }
  
          res.status(500).send('Error signing up');
          return;
        }
        res.status(200).send('User signed up successfully');
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).send('Username already exists');
      }
      res.status(500).send('Error signing up: ', error);
    }
  }
  else{
    res.status(400).send('Password does not meet the requirements');
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

// Reset Password Function
app.post('/resetPassword', async (req, res) => {
  const { username, firstName, lastName, email } = req.body;

  try {
    const query = 'SELECT * FROM user_info WHERE email = ?';
    db.query(query, [email], async (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Error finding account');
      }

      if (result.length === 0) {
        return res.status(404).send('Account not found');
      }

      const user = result[0];
      if (!secureCompare(username, user.username) ||
        !secureCompare(firstName, user.firstName) ||
        !secureCompare(lastName, user.lastName)) {
        return res.status(401).send('Invalid account information');
      }

      // Create reset token with expiration (1 hour)
      const secret = user.password + '-' + user.lastName + '-' + user.userId;
      const token = jwt.sign(
        { id: user.userId, email: user.email },
        secret,
        { expiresIn: '1h' }
      );

      // Generate reset link
      const resetLink = `${req.protocol}://${req.get('host')}/resetpassword/${user.userId}/${token}`;

      // Send email
      try {
        const mailOptions = createPasswordResetEmail(
          user.email,
          user.firstName,
          resetLink
        );

        await transporter.sendMail(mailOptions);
        res.status(200).send('Password reset email sent successfully');
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        res.status(500).send('Failed to send reset email');
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Internal server error');
  }
});

// Password reset confirmation
app.get('/resetpassword/:id/:token', (req, res) => {
  const userId = req.params.id;
  const token = req.params.token;

  try {
    const query = 'SELECT * FROM user_info WHERE userId = ?';
    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Error finding account');
      }

      if (result.length === 0) {
        return res.status(404).send('User not found');
      }

      const user = result[0];
      const secret = user.password + '-' + user.lastName + '-' + user.userId;

      try {
        const payload = jwt.verify(token, secret);
        // If we get here, token is valid
        // Render a password reset form
        res.send(`<!DOCTYPE html>
          <html>
          <head>
            <title>Reset Password</title>
            <style>
              .error { color: red; margin-top: 5px; }
              input { display: block; margin-bottom: 10px; }
            </style>
          </head>
          <body>
            <h1>Reset Password</h1>
            <form id="resetForm">
              <input type="hidden" name="userId" value="${user.userId}">
              <input type="hidden" name="token" value="${token}">
              
              <div>
                <label>New Password:</label>
                <input type="password" id="newPassword" name="newPassword" required>
                <div id="passwordError" class="error"></div>
              </div>
              
              <div>
                <label>Confirm Password:</label>
                <input type="password" id="confirmPassword" required>
                <div id="confirmError" class="error"></div>
              </div>
              
              <button type="submit" id="submitBtn">Reset Password</button>
              <div id="formError" class="error"></div>
            </form>

            <script>
              document.addEventListener('DOMContentLoaded', function() {
                const passwordInput = document.getElementById('newPassword');
                const confirmInput = document.getElementById('confirmPassword');
                const passwordError = document.getElementById('passwordError');
                const confirmError = document.getElementById('confirmError');
                const submitBtn = document.getElementById('submitBtn');
                const form = document.getElementById('resetForm');

                function validatePassword(password) {
                  const rules = {
                    length: password.length >= 8 && password.length <= 20,
                    upper: /[A-Z]/.test(password),
                    lower: /[a-z]/.test(password),
                    number: /[0-9]/.test(password),
                    specialChar: /[!@#$%^&*]/.test(password)
                    
                    
                  };

                  if (!rules.length) return "Must be 8-20 characters";
                  if (!rules.upper) return "Need at least 1 uppercase letter";
                  if (!rules.lower) return "Need at least 1 lowercase letter";
                  if (!rules.number) return "Need at least 1 number";
                  if (!rules.specialChar) return "Need at least 1 special character (!@#$%^&*)";
                  
                  
                  return null;
                }

                function validateConfirmPassword() {
                  if (passwordInput.value !== confirmInput.value) {
                    confirmError.textContent = "Passwords don't match";
                    return false;
                  }
                  confirmError.textContent = "";
                  return true;
                }

                // Real-time validation
                passwordInput.addEventListener('input', function() {
                  const error = validatePassword(passwordInput.value);
                  passwordError.textContent = error || "";
                  validateConfirmPassword();
                });

                // Password confirmation check
                confirmInput.addEventListener('input', validateConfirmPassword);

                // Form submission
                form.addEventListener('submit', async function(e) {
                  e.preventDefault();
                  
                  const passwordErrorMsg = validatePassword(passwordInput.value);
                  const passwordsMatch = validateConfirmPassword();
                  
                  if (passwordErrorMsg || !passwordsMatch) {
                    return;
                  }

                  submitBtn.disabled = true;
                  submitBtn.textContent = "Processing...";

                  try {
                    const response = await fetch('/updatePassword', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        userId: form.userId.value,
                        token: form.token.value,
                        newPassword: passwordInput.value
                      })
                    });

                    const data = await response.json();
                    
                    if (!response.ok) {
                      // Show server-provided error message
                      document.getElementById('formError').textContent = 
                      data.error || "Password reset failed (code: " + response.status + ")";
                      throw new Error(data.error);
                    } 
                    alert("Password updated successfully!");
                  } catch (error) {
                    passwordError.textContent = error.message;
                  } finally {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Reset Password";
                  }
                });
              });
            </script>
          </body>
          </html>
        `);
      } catch (jwtError) {
        console.error('Token verification failed:', jwtError);
        res.status(400).send('Invalid or expired reset link');
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Internal server error');
  }
});

app.post('/updatePassword', async (req, res) => {
  const { userId, token, newPassword } = req.body;
  if (!userId || !token || !newPassword) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Password validation
  const validation = validatePassword(newPassword);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }

  try {
    // First verify the token is valid
    const query = 'SELECT * FROM user_info WHERE userId = ?';
    db.query(query, [userId], async (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Error finding account');
      }
      if (result.length === 0) {
        return res.status(404).send('User not found');
      }
      const user = result[0];
      const secret = user.password + '-' + user.lastName + '-' + user.userId;
      try {
        // Verify the token

        console.log("Token expiration:", jwt.decode(token).exp);
        console.log("Current timestamp:", Math.floor(Date.now() / 1000));
        jwt.verify(token, secret);
        // Hash the new password
        const hashedPassword = await hashPassword(newPassword);
        // Update the password in the database
        const updateQuery = 'UPDATE user_info SET password = AES_ENCRYPT(?, ?) WHERE userId = ?';
        db.query(updateQuery, [newPassword, secretKey, userId], (updateErr, updateResult) => {
          if (updateErr) {
            console.error('Error updating password:', updateErr);
            return res.status(500).send('Error updating password');
          }
          if (updateResult.affectedRows === 0) {
            return res.status(404).send('User not found');
          }
          res.status(200).json({ message: 'Password updated successfully' });
        });
      } catch (jwtError) {
        console.error('Token verification failed:', jwtError);
        res.status(400).send('Invalid or expired reset link');
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Internal server error');
  }
});

app.get('/get_user', async (req, res) => {
  try {
    getUserQuery = 
    `
    SELECT firstName, lastName FROM user_info
    `

    db.query(getUserQuery, (errGetUser, getUserResult) => {
      if (errGetUser) {
        console.error('Error getting users:', errGetUser);
        res.status(500).send('Error getting users');
        return;
      }

      return res.status(200).send({
        data: getUserResult
      });

    })

  } catch (error) {
    res.status(500).send('Error getting users: ', error);
  }
})

app.post('/add_note', async (req, res) => {
  const { noteId, username, noteTitle, noteContent, notePinned } = req.body;

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
      SET name = ?, description = ?, pinned = ?
      WHERE noteId = ?
      `

      db.query(modifyNoteQuery, [noteTitle, noteContent, notePinned, noteId], (errModifyNote, resultModifyNote) => {

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
      const addNoteQuery = "INSERT INTO note (name, description, pinned) VALUES (?, ?, ?)";

      db.query(addNoteQuery, [noteTitle, noteContent, notePinned], (errAddNote, resultAddNote) => {

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
      `SELECT n.noteId, n.name, n.description, n.pinned FROM note as n
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

app.post('/pin_note', async (req, res) => {
  const { noteId, notePinned } = req.body;

  if (!noteId) {
    res.status(400).send('No note found.');
    return;
  }

  try {
    const pinNoteQuery =
      `
    UPDATE note
    SET pinned = ?
    WHERE noteId = ?
    `

    db.query(pinNoteQuery, [notePinned, noteId], (errPinNote, pinNoteResult) => {
      if (errPinNote) {
        console.error('Error retrieving notes:', errPinNote);
        res.status(500).send('Error retrieving notes');
        return;
      }

      res.status(201).send("Note pinned successfully");
    });

  } catch (error) {
    res.status(500).send('Error pinning note: ', error);
  }
});

app.post('/add_event', async (req, res) => {
  const {username, title, assignedStaff, start, end, x, y, color } = req.body;

  const addEventQuery = `
    INSERT INTO calendar (title, assigned_staff, start, end, x, y, color)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    db.query(addEventQuery, [title, assignedStaff, start, end, x, y, color], (errAddEvent, addEventResult) => {
      if (errAddEvent) {
        console.error('Error adding calendar event: ', errAddEvent);
        res.status(500).send('Error adding calendar event');
        return;
      }

      const eventId = addEventResult.insertId;

      const addEventRelationshipQuery = 
      `
      INSERT INTO user_calendar (userId, calendarId)
      SELECT ui.userId, c.calendarId
      FROM user_info AS ui
      LEFT JOIN calendar AS c ON calendarId = ?
      WHERE ui.username = ?
      `

      db.query(addEventRelationshipQuery, [eventId, username], (errAddEventRelationship, addEventRelationshipResult) => {
        if (errAddEventRelationship) {
          console.error('Error adding event relationship: ', errAddEventRelationship);
          res.status(500).send('Error adding event relationship');
          return;
        }
      })

      return res.status(200).send('Event added successfully');
    });
  } catch (error) {
    res.status(500).send("Error adding calendar event: ", error);
    console.error(error);
  }
});

app.get('/get_event', async (req, res) => {
  const getEventQuery =
    `
  SELECT * FROM calendar
  `
  try {
    db.query(getEventQuery, (errGetEvent, getEventResult) => {
      if (errGetEvent) {
        console.error('Error getting calendar events: ', errGetEvent);
        res.status(500).send('Error getting calendar events');
        return;
      }

      return res.status(200).send({
        data: getEventResult
      });
    });
  } catch (error) {
    res.status(500).send("Error getting calendar events: ", error);
    console.error(error);
  }
});

app.post('/add_message', async (req, res) => {
  const { username, message, sendTime, replyTo } = req.body;

  if (!username) {
    return res.status(400).send("No user credentials found");
  }

  let isReply = false;
  if (replyTo != null) isReply = true;

  const addMessageQuery =
    `
  INSERT INTO chatbox (message, sendTime, isReply)
  VALUES (?, ?, ?)
  `

  try {
    db.query(addMessageQuery, [message, sendTime, isReply], (errAddMessage, addMessageResult) => {
      if (errAddMessage) {
        console.error('Error adding message: ', errAddMessage);
        res.status(500).send('Error adding message');
        return;
      }

      const messageId = addMessageResult.insertId;

      const addUserMessageQuery =
        `
      INSERT INTO user_message (userId, messageId)
      SELECT ui.userId, m.messageId
      FROM user_info AS ui
      JOIN chatbox AS m ON m.messageId = ?
      WHERE ui.username = ?
      `

      db.query(addUserMessageQuery, [messageId, username], (errAddUserMessage, addUserMessageResult) => {
        if (errAddUserMessage) {
          console.error('Error adding user-message relationship: ', errAddUserMessage);
          res.status(500).send('Error adding user-message relationship');
          return;
        }
      })

      if (isReply) {
        const addReplyQuery =
          `
        INSERT INTO reply_to (messageFromId, messageToId)
        VALUES (?, ?)
        `

        db.query(addReplyQuery, [messageId, replyTo], (errAddReply, addReplyResult) => {
          if (errAddReply) {
            console.error('Error adding reply relationship: ', errAddReply);
            res.status(500).send('Error adding reply relationship');
            return;
          }
        });
      }

      return res.status(200).send({
        data: messageId
      });
    });

  } catch (error) {
    res.status(500).send("Error adding message: ", error);
    console.error(error);
  }
});

app.get('/get_message', async (req, res) => {
  const getMessageQuery =
  `
  SELECT 
  c.*, 
  r.messageToId AS replyId
  FROM chatbox c
  LEFT JOIN reply_to r ON c.messageId = r.messageFromId;
  `
  
  try {
    db.query(getMessageQuery, (errGetMessage, getMessageResult) => {
      if (errGetMessage) {
        console.error('Error getting message: ', errGetMessage);
        res.status(500).send('Error getting message');
        return;
      }

      return res.status(200).send({
        data: getMessageResult,
      });
    });
  } catch (error) {
    res.status(500).send("Error getting messages: ", error);
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});