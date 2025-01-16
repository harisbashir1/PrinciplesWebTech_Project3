import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const StudentRegistration = () => {

//store errors in state variable to display when validating the form
const [errors, setErrors] = useState({});
const validationPatterns = {
  name: /^[A-Za-z]+$/, //One or more characters (only letters)
  userId: /^\d{8}$/, //exactly an 8 digit number
  email: /^[a-zA-Z0-9]+@[a-zA-Z0-9]{1,20}(\.[a-zA-Z0-9]{1,20})+$/, // 1 or moreletters and numbers + @ + domain + dot + at least 1 more domain 
  phone: /^\d{3}-\d{3}-\d{4}$/ // 3 digits + - + 3 digits + - + 4 digits
};
const validateForm = () => {
  const submissionErrors = {};

  if (!firstName.match(validationPatterns.name)) {
    submissionErrors.firstName = 'First name must contain only letters';
  }
  if (!lastName.match(validationPatterns.name)) {
    submissionErrors.lastName = 'Last name must contain only letters';
  }
  if (!userID.match(validationPatterns.userId)) {
    submissionErrors.userID = 'ID must be exactly 8 digits, with no other characters';
  }
  if (!email.match(validationPatterns.email)) {
    submissionErrors.email = 'Invalid email format (example@example.example.example)';
  } else {
    const domain = email.split('@')[1]; //get domain (right side of @)
    if (domain.length > 80) {
      submissionErrors.email = 'Domain name has to be less than 80 characters (including dots)';
    }
  }
  if (!phoneNumber.match(validationPatterns.phone)) {
    submissionErrors.phoneNumber = 'Phone must be in format: 999-999-9999, include hyphens';
  }
  //populate state variable for errors
  setErrors(submissionErrors);
  //check if array has any errors or is empty
  return Object.keys(submissionErrors).length === 0;
};


const [email, setEmail] = useState('');
const [userID, setID] = useState('');
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [projectTitle, setProjectTitle] = useState('');
const [phoneNumber, setPhoneNumber] = useState('');
const [selectedSlot, setSelectedSlot] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  try {
    const res = await axios.post('http://localhost:5050/register', {
      userID,
      firstName,
      lastName,
      email,
      phoneNumber,
      projectTitle,
      selectedSlot,
    });

    if (res.status == 200) {
      alert(res.data);
    }

    //user with same ID is already registered and needs to override
    if (res.data.requireConfirmation) {
      const { currentRegistration } = res.data;

      const confirmOverride = window.confirm(
        `A user with your ID has already registered:
        * ID: ${currentRegistration.student_id}
        * Name: ${currentRegistration.first_name} ${currentRegistration.last_name}
        * Project Title: ${currentRegistration.project_title}
        * Time Slot ID#: ${currentRegistration.time_slot_id}
        
        Would you like to override your previous registration?`
      );

      if (confirmOverride) {
        try {
          const overrideRes = await axios.post('http://localhost:5050/register', {
            userID,
            firstName,
            lastName,
            email,
            phoneNumber,
            projectTitle,
            selectedSlot,
            confirmOverride: true,
          });

          alert(overrideRes.data);
        } catch (overrideErr) {
          alert('An error occurred while overriding your registration. Please try again.');
        }
      }
    }
  } catch (err) {
    console.error('Error during registration:', err);
    alert(err.response.data);
  }
};
  //state variable for available time slots for dropdown menu
  const [freeTimeSlots, setFreeTimeSlots] = useState([]);
  useEffect(() => {
    fetch('http://localhost:5050/availableSlots', {
    })
      .then((response) => response.json())
      .then((data) => setFreeTimeSlots(data))
      .catch((error) => console.error('Error fetching available Slots:', error));
  }, []);
    
    const [allTimeSlots, setAllTimeSlots] = useState([]);
    useEffect(() => {
      fetch('http://localhost:5050/allSlots', {
      })
        .then((response) => response.json())
        .then((data) => setAllTimeSlots(data))
        .catch((error) => console.error('Error fetching Slots:', error));
    }, []);

  return (
    <div>
      {/* Header */}
      <header>
        <h1>Project Demo Sign-up</h1>
        <nav>
          <ul className = 'nav-menu'>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/ViewTimeslots">View Timeslots</Link></li>
          </ul>
        </nav>
        <hr/>
      </header>
  
      {/* Main Content */}
      <main>
      <h2>List of Time Slots</h2>
      <table>
          <thead>
            <tr>
              <th>Time Slot</th>
              <th>Remaining Seats</th>
            </tr>
          </thead>
          <tbody>
            {allTimeSlots.map(slot => (
              <tr key={slot.time_slot_id}>
                <td>{new Date(slot.slot_datetime).toLocaleString('en-US')}</td>
                <td>{slot.remaining_seats}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>Register for a time slot</h2>
      </main>
      <div class= 'form'>
      <form onSubmit={handleSubmit}>
      <div className="form-group">
          <label>User ID:</label>
          <input
            type="text"
            value={userID}
            onChange={(e) => setID(e.target.value)}
            required
          />
          {/* if there is an error message display the span element with error message, (same for other errors) */}
           {errors.userID && <span className="error">{errors.userID}</span>}
        </div>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          {errors.firstName && <span className="error">{errors.firstName}</span>}
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
        </div>
        <div className="form-group">
          <label>Project Title:</label>
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
            <label>Select a Time Slot:</label>
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              required
            >
              <option value="" disabled>Select a timeslot</option>
              {freeTimeSlots.map((slot) => (
                <option key={slot.id} value={slot.time_slot_id}>
                  {new Date(slot.slot_datetime).toLocaleString('en-US')}
                </option>
              ))}
            </select>
          </div>
        <button type="submit">Register</button>
      </form>
      </div>
  
      {/* Footer */}
      <footer>
      <p>This site was created by Haris Bashir</p>
      </footer>
    </div>
  );

};

export default StudentRegistration;