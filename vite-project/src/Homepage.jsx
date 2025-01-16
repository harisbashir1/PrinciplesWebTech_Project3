import React from 'react';
import { Link } from 'react-router-dom';


const HomePage = () => {
  
  return (
    <div>
      {/* Header */}
      <header>
      <h1>Project Demo Sign-up</h1>
        <nav>
          <ul class = 'nav-menu'>
            <li><Link to="/ViewTimeslots">View Timeslots</Link></li>
            <li><Link to="/StudentRegistration">Student Registration</Link></li>
          </ul>
        </nav>
        <hr/>
      </header>
  
      {/* Main Content */}
      <main>
        <h1>Welcome to the project signup site</h1>
        <h2>Here students can register for a timeslot for their presentation.<br></br><br></br>
          There are a total of 6 times, each with 6 available slots (36 students can register).<br></br><br></br>
          If already registered you will be asked to override your previous registration.<br></br><br></br>
          Remaining seats are automatically incremented and decremented using a trigger.
        </h2>
      </main>
  
      {/* Footer */}
      <footer>
      <p>This site was created by Haris Bashir</p>
      </footer>
    </div>
  );
  };
  
  export default HomePage;