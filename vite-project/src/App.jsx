import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import HomePage from './Homepage';
import StudentRegistration from './StudentRegistration'
import ViewTimeslots from './ViewTimeslots'
function App() {

  return (
      <Router>
      <Routes>

        <Route path="/" element={<HomePage />} />
    
        <Route path="/StudentRegistration" element={<StudentRegistration />} />
        
        <Route path="/ViewTimeslots" element={<ViewTimeslots/>} />
 
      </Routes>
    </Router>
  );
}

export default App
