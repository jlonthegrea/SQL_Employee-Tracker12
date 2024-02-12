USE employee_db;




INSERT INTO department (name)
VALUES
('Sales'), ('Finance'), ('Legal'), ('Engineering'), ('Operations');

INSERT INTO role (title, salary, department_id)
VALUES
('Sales Representative', 60000, 1),
('Marketing Exective', 75000, 1),
('Chief Finacial Officer', 190000, 2),
('Treasurer', 200000, 2),
('Lawyer', 110000, 3),
('Software Engineer', 125000, 4),
('Lead Engineer', 150000, 4),
('Project Manager', 100000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Sam', 'Wilson', 3, null),
('Joe', 'Okivie', 4, null),
('Kenneth', 'Sumlin', 1, 1),
('Jaylen', 'Johnson', 5, null),
('Benjamin', 'Pain', 2, 2),
('Tony', 'Soprano', 6, null),
('Jake', 'Snake', 8, 4),
('Michael', 'Jackson', 7, null);
