import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
const ViewTimeslots = () => {


  const [allTimeSlots, setAllTimeSlots] = useState([]);
  useEffect(() => {
    fetch('http://localhost:5050/allSlots', {
    })
      .then((response) => response.json())
      .then((data) => setAllTimeSlots(data))
      .catch((error) => console.error('Error fetching available Slots:', error));
  }, []);

  const [studentRegistrations, setStudentRegistrations] = useState([]);
  useEffect(() => {
    fetch('http://localhost:5050/registeredStudents', {
    })
      .then((response) => response.json())
      .then((data) => setStudentRegistrations(data))
      .catch((error) => console.error('Error fetching available Slots:', error));
  }, []);

  return (
    <div>
      {/* Header */}
      <header>
      <h1>Project Demo Sign-up</h1>
        <nav>
          <ul class = 'nav-menu'>
          <li><Link to="/">Home</Link></li>
            <li><Link to="/StudentRegistration">Student Registration</Link></li>
          </ul>
        </nav>
        <hr/>
      </header>
  
      {/* Main Content */}
      <main>
        <h2>All Time Slots</h2>
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
        <h2>Registered Students</h2>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Project Title</th>
              <th>Selected Slot ID</th>
              <th>Selected Slot Datetime</th>
            </tr>
          </thead>
          <tbody>
            {studentRegistrations.map((student) => (
              <tr key={student.student_id}>
                <td>{student.student_id}</td>
                <td>{student.first_name}</td>
                <td>{student.last_name}</td>
                <td>{student.email}</td>
                <td>{student.phone_number}</td>
                <td>{student.project_title}</td>
                <td>{student.time_slot_id}</td>
                <td>{new Date(student.slot_datetime).toLocaleString('en-US')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
  
      {/* Footer */}
      <footer>
      <p>This site was created by Haris Bashir</p>
      </footer>
    </div>
  );

};

export default ViewTimeslots;