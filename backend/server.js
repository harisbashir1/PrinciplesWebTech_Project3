const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

//create mySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,  
  user: process.env.DB_USER,       
  password: process.env.DB_PASS,      
  database: process.env.DB_NAME, 
  });

// Connect to the MySQL database
db.connect(err => {
    if (err) {
      console.error('Database connection failed:', err.stack);
      return;
    }
    console.log('Connected to MySQL database.');
  });
  
  // Start the server and listen on port defined
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  //query slots with OPEN seats
  app.get('/availableSlots', (req, res) => {
    const query = 'SELECT * FROM time_slots WHERE remaining_seats > 0';
  
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).send('Error fetching available slots');
      }
      res.status(200).json(results);
    });
  });


  //query ALL slots (including full)
  app.get('/allSlots', (req, res) => {
    const query = 'SELECT * FROM time_slots';
  
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).send('Error fetching available slots');
      }
      res.status(200).json(results);
    });
  });


  //query registered student data to display in table
  app.get('/registeredStudents', (req, res) => {
    const query = `
    SELECT 
      students.student_id, 
      students.first_name, 
      students.last_name, 
      students.email, 
      students.phone_number, 
      students.project_title, 
      students.time_slot_id, 
      time_slots.slot_datetime 
    FROM 
      students
    INNER JOIN 
      time_slots 
    ON 
      students.time_slot_id = time_slots.time_slot_id`;

    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).send('Error fetching registered student data');
      }
      res.status(200).json(results);
    });
  });


  //endpoint for students to register
  //handles cases where student is already registered as well
  app.post('/register', (req, res) => {
    const { userID, firstName, lastName, email, phoneNumber, projectTitle, selectedSlot, confirmOverride } = req.body;

    //reject registration if selected timeslot is full
    const checkRemainingSlotsQuery = 'SELECT remaining_seats FROM time_slots WHERE time_slot_id = ?';
    db.query(checkRemainingSlotsQuery, [selectedSlot], (err, seatsResult) => {
        if (err) {
            return res.status(500).send('error checking remaining seats');
        }
        const remainingSeats = seatsResult[0].remaining_seats;

        if (remainingSeats <= 0) {
            return res.status(400).send('Selected time is full. Please change your time');
        }

    //check for student with same ID already registered
    const checkPreviousRegistrationQuery = 'SELECT * FROM students WHERE student_id = ?';
    db.query(checkPreviousRegistrationQuery, [userID], (err, result) => {
        if (err) {
            console.error('Error checking registration:', err.stack);
            return res.status(500).send('An error occurred while checking your registration, please try again.');
        }
        //previous registration was found
        if (result.length > 0) {
            if (!confirmOverride) {
                //send registration details and ask for confirmation
                return res.status(201).json({
                    message: 'User already registered.',
                    requireConfirmation: true,
                    currentRegistration: result[0],
                });
            } 
            //procedure if user confirms override
            else {
                // Delete previous registration
                const deleteQuery = 'DELETE FROM students WHERE student_id = ?';
                db.query(deleteQuery, [userID], (err) => {
                    if (err) {
                        return res.status(500).send('An error occurred while deleting your previous registration, please try again.');
                    }

                // Insert new registration
                const insertQuery = `
                    INSERT INTO students (student_id, first_name, last_name, email, phone_number, project_title, time_slot_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?)`;

                    db.query(
                        insertQuery,
                        [userID, firstName, lastName, email, phoneNumber, projectTitle, selectedSlot],
                        (err) => {
                            if (err) {
                                return res.status(500).send('An error occurred while submitting your registration, please try again.');
                            }
                            res.status(200).send('Registration successfully overridden!');
                        }
                    );
                });    
            }
        } 
        //Else No previous registration found, proceed insert as normal
        else {
            const insertQuery = `
              INSERT INTO students (student_id, first_name, last_name, email, phone_number, project_title, time_slot_id)
              VALUES (?, ?, ?, ?, ?, ?, ?)`;

            db.query(
                insertQuery,
                [userID, firstName, lastName, email, phoneNumber, projectTitle, selectedSlot],
                (err) => {
                    if (err) {
                        return res.status(500).send('An error occurred while submitting your registration, please try again.');
                    }
                    res.status(200).send('Registration successful!');
                }
            );
        }
    });
});
});


