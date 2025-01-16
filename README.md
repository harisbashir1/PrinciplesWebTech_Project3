## How to Run the Project

Follow these steps to clone and run this project on your local machine.

### Step 1: Clone or Download the project

First, clone or download this project to your local machine.

   ```bash
   git clone https://github.com/harisbashir1/PrinciplesWebTech_Project3.git
   ```

### Step 2: Set Up the Backend (Express & MySQL)
### -Make sure MySQL service is running before proceeding. You can use XAMPP, MAMP, or MySQL Workbench to start the MySQL service.
### Note: The trigger creation queries were tested with XAMPP and phpMyAdmin,

1. **Navigate to the `backend` directory**:

   ```bash
   cd backend
   ```

2. **Install the backend dependencies**:

   ```bash
   npm install
   ```

3. **Create the MySQL Database and Table**:

   - Start your MySQL service (using XAMPP, MAMP, or MySQL Workbench).
   - Open a MySQL client (like MySQL Workbench or the command line) and run the following SQL commands to create the database and tables:


Create tables and populate time slots with data
```sql

CREATE DATABASE student-demo-registration;
USE student-demo-registration;

CREATE TABLE time_slots (
    time_slot_id INT AUTO_INCREMENT PRIMARY KEY,
    slot_datetime DATETIME NOT NULL,
    remaining_seats INT NOT NULL DEFAULT 6
);

CREATE TABLE students (
    student_id INT PRIMARY KEY,        
    first_name VARCHAR(255) NOT NULL,                 
    last_name VARCHAR(255) NOT NULL,                  
    project_title VARCHAR(255) NOT NULL,              
    email VARCHAR(255) NOT NULL UNIQUE,               
    phone_number VARCHAR(15) NOT NULL,                
    time_slot_id INT,                                 
    FOREIGN KEY (time_slot_id) REFERENCES time_slots(time_slot_id)
);

DELIMITER $$
CREATE TRIGGER `after_student_insert` 
AFTER INSERT ON `students` 
FOR EACH ROW 
BEGIN
    UPDATE time_slots
    SET remaining_seats = remaining_seats - 1
    WHERE time_slot_id = NEW.time_slot_id;
END
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `after_student_delete` 
AFTER DELETE ON `students` 
FOR EACH ROW 
BEGIN
    UPDATE time_slots
    SET remaining_seats = remaining_seats + 1
    WHERE time_slot_id = OLD.time_slot_id;
END
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `after_student_update` 
AFTER UPDATE ON `students`
FOR EACH ROW 
BEGIN
    IF OLD.time_slot_id != NEW.time_slot_id THEN
        UPDATE time_slots
        SET remaining_seats = remaining_seats + 1
        WHERE time_slot_id = OLD.time_slot_id;
        
        UPDATE time_slots
        SET remaining_seats = remaining_seats - 1
        WHERE time_slot_id = NEW.time_slot_id;
    END IF;
END $$
DELIMITER ;

INSERT INTO time_slots (slot_datetime) VALUES
('2070-04-19 18:00:00'),
('2025-04-19 19:00:00'),
('2025-04-19 20:00:00'),
('2025-04-19 18:00:00'),
('2025-04-19 19:00:00'),
('2025-04-19 20:00:00');
```


4. **Start the backend server**:

   ```bash
   npm start
   ```
   The backend will run on `http://localhost:5050`.

### Step 3: Set Up the Frontend (React)

1. **Navigate to the `vite-project` directory**:

2. **Install the frontend dependencies**:

   ```bash
   npm install
   ```

3. **Start the frontend server**:

   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

### Step 4: Usage

1. **Access the Web Application**:

   Open your browser and go to `http://localhost:5173`. This will load the homepage of the application.

