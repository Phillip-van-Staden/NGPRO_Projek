const express = require('express');
const sqlite3 = require('sqlite3').verbose();

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
        USER_FNAME TEXT NOT NULL,
        USER_LNAME TEXT NOT NULL,
        USER_EMAIL TEXT NOT NULL,
        USER_PASSWORD TEXT NOT NULL  
    )`);
});
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({ storage });

// Serve static files
app.use('/uploads', express.static('uploads'));

// Route to get all messages
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

// Route to get messages for a specific project
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

// Route to upload files
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

/// Route to upload files
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

// Route to get all files
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

// Route to download a specific file
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

// // Create messages for a project
// app.post('/projects/:projectId/messages', (req, res) => {
//     const { projectId } = req.params;
//     const { message } = req.body;

//     db.run(
//         'INSERT INTO messages (message, project_id) VALUES (?, ?)',
//         [message, projectId],
//         function (err) {
//             if (err) {
//                 return res.status(500).json({ error: err.message });
//             }
//             res.status(201).json({ id: this.lastID, message });
//         }
//     );
// });

// // Get messages for a project
// app.get('/projects/:projectId/messages', (req, res) => {
//     const { projectId } = req.params;

//     db.all(
//         'SELECT * FROM messages WHERE project_id = ?',
//         [projectId],
//         (err, rows) => {
//             if (err) {
//                 return res.status(500).json({ error: err.message });
//             }
//             res.json(rows);
//         }
//     );
// });



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});