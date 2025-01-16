## How to Run the Project

Create tables and populate time slots with data
```sql
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
TODO:

FIX EMAIL
ADD FUNCTIONALITY FOR ALREADY REGISTERED STUDENTS