-- Departments

INSERT INTO departments
(code, name, hod_name)
VALUES
('CSE', 'Computer Science and Engineering', 'Dr. Suresh Kumar'),
('ECE', 'Electronics and Communication Engineering', 'Mr. M Dileep'),
('EEE', 'Electrical and Electronics Engineering', 'Dr. Prakash Rao'),
('AIML', 'Artificial Intelligence and Machine Learning', 'Dr. Anitha Sharma'),
('ME', 'Mechanical Engineering', 'Dr. Reddy')
ON CONFLICT (code) DO NOTHING;