const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./Projek.db');
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        start_date TEXT,
        end_date TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT,
        project_id INTEGER,
        FOREIGN KEY (project_id) REFERENCES projects (id)
    )`);
    

    db.run(`CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT,
        filedata BLOB
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS USER (
        USER_ID INTEGER PRIMARY KEY AUTOINCREMENT,
        USER_NAME TEXT NOT NULL,
        USER_EMAIL TEXT NOT NULL,
        USER_PASSWORD TEXT NOT NULL,
        USER_CREATED DATE NOT NULL,
        USER_UPDATED DATE
        )`);

    db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        taskName TEXT,
        taskDescription TEXT,
        taskStart TEXT,
        taskEnd TEXT,
        tStatus TEXT,
        project_id INTEGER,
        FOREIGN KEY (project_id) REFERENCES projects (id)
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        event_date TEXT
    )`);
});
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({ storage });


app.use('/uploads', express.static('uploads'));

// Get all messages
app.post('/projects/:projectId/messages', (req, res) => {
    const { projectId } = req.params;
    const { message } = req.body;

    db.run(
        'INSERT INTO messages (message, project_id) VALUES (?, ?)',
        [message, projectId],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID, message });
        }
    );
});

// Get messages for a specific project
app.get('/projects/:projectId/messages', (req, res) => {
    const { projectId } = req.params;

    db.all(
        'SELECT * FROM messages WHERE project_id = ?',
        [projectId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ messages: rows });
        }
    );
});

// Upload files
app.post('/upload', upload.array('files'), (req, res) => {
    const files = req.files;
    const placeholders = files.map(() => '(?, ?)').join(',');
    const values = files.flatMap(file => {
        const fileContent = fs.readFileSync(file.path); 
        return [file.originalname, fileContent]; 
    });

    db.run(`INSERT INTO files (filename, filedata) VALUES ${placeholders}`, values, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ uploaded: this.changes });
    });
});

/// Upload files
app.post('/upload', upload.array('files'), (req, res) => {
    const files = req.files;
    const placeholders = files.map(() => '(?, ?)').join(',');
    const values = files.flatMap(file => {
        const fileContent = fs.readFileSync(file.path); 
        return [file.originalname, fileContent]; 
    });

    db.run(`INSERT INTO files (filename, filedata) VALUES ${placeholders}`, values, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ uploaded: this.changes });
    });
});

// Get all files
app.get('/files', (req, res) => {
    db.all('SELECT * FROM files', [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        const files = rows.map(row => ({
            id: row.id,
            filename: row.filename,
            filedata: Buffer.from(row.filedata).toString('base64')
        }));

        res.json({ files });
    });
});

// Download a specific file
app.get('/files/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM files WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'File not found' });
            return;
        }
        res.setHeader('Content-Disposition', `attachment; filename=${row.filename}`);
        res.send(row.filedata);
    });
});

// Get all projects
app.get('/projects', (req, res) => {
    db.all('SELECT * FROM projects', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ projects: rows });
    });
});

// Add a new project
app.post('/projects', (req, res) => {
    const { name, description, start_date, end_date } = req.body;
    db.run(`INSERT INTO projects (name, description, start_date, end_date) VALUES (?, ?, ?, ?)`, 
    [name, description, start_date, end_date], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

// Update an existing project
app.put('/projects/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, start_date, end_date } = req.body;
    db.run(`UPDATE projects SET name = ?, description = ?, start_date = ?, end_date = ? WHERE id = ?`, 
    [name, description, start_date, end_date, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ updated: this.changes });
    });
});

// Delete a project
app.delete('/projects/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM projects WHERE id = ?`, id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ deleted: this.changes });
    });
});


// Add a new task to a specific project
app.post('/projects/:projectId/tasks', (req, res) => {
    const { projectId } = req.params;
    const { taskName, taskDescription, taskStart, taskEnd, tStatus } = req.body;

    db.run(
        'INSERT INTO tasks (taskName, taskDescription, taskStart, taskEnd, tStatus, project_id) VALUES (?, ?, ?, ?, ?, ?)',
        [taskName, taskDescription, taskStart, taskEnd, tStatus, projectId],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID, taskName, taskDescription, taskStart, taskEnd, tStatus });
        }
    );
});

// Get tasks for a specific project
app.get('/projects/:projectId/tasks', (req, res) => {
    const { projectId } = req.params;

    db.all(
        'SELECT * FROM tasks WHERE project_id = ?',
        [projectId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ tasks: rows });
        }
    );
});

// Update a task
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { taskName, taskDescription, taskStart, taskEnd, tStatus } = req.body;

    db.run(
        `UPDATE tasks SET taskName = ?, taskDescription = ?, taskStart = ?, taskEnd = ?, tStatus = ? WHERE id = ?`,
        [taskName, taskDescription, taskStart, taskEnd, tStatus, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ updated: this.changes });
        }
    );
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM tasks WHERE id = ?`, id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ deleted: this.changes });
    });
});


// Get all events
app.get('/events', (req, res) => {
    db.all('SELECT * FROM events', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ events: rows });
    });
});

// Add a new event
app.post('/events', (req, res) => {
    const { title, description, event_date } = req.body;
    db.run(`INSERT INTO events (title, description, event_date) VALUES (?, ?, ?)`,
        [title, description, event_date],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID, title, description, event_date });
        });
});

// Delete an event
app.delete('/events/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM events WHERE id = ?`, id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ deleted: this.changes });
    });
});

// Update an event
app.put('/events/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, event_date } = req.body;
    db.run(`UPDATE events SET title = ?, description = ?, event_date = ? WHERE id = ?`,
        [title, description, event_date, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ updated: this.changes });
        });
});

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    db.get(`SELECT * FROM USER WHERE USER_EMAIL = ?`, [email], (err, row) => {
        if (err) {
            console.error('Database error during sign-up:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (row) {
            return res.status(400).json({ message: 'User already exists' });
        }

       
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).json({ error: 'Error hashing password' });
            }

            const date = new Date().toISOString();
            db.run(
                `INSERT INTO USER (USER_NAME, USER_EMAIL, USER_PASSWORD, USER_CREATED, USER_UPDATED) 
                VALUES (?, ?, ?, ?, ?)`, 
                [username, email, hashedPassword, date, date], 
                function (err) {
                    if (err) {
                        console.error('Error creating user:', err);
                        return res.status(500).json({ error: 'Error creating user' });
                    }

                    res.status(201).json({ message: 'User created successfully', userId: this.lastID });
                }
            );
        });
    });
});


// Route for user login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM USER WHERE USER_EMAIL = ?`, [email], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!row) {
            return res.status(400).json({ message: 'User not found' });
        }

        bcrypt.compare(password, row.USER_PASSWORD, (err, isMatch) => {  
            if (err) {
                return res.status(500).json({ error: 'Error comparing passwords' });
            }
            if (!isMatch) {
                return res.status(400).json({ message: 'Incorrect password' });
            }

            res.status(200).json({ message: 'Login successful' });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});