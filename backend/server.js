require('dotenv').config(); // Load variables from .env
// server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Create table if not exists
db.query(`CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  address TEXT
);`);

// CRUD Routes
app.get('/contacts', (req, res) => {
  db.query("SELECT * FROM contacts", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.post('/contacts', (req, res) => {
  const { firstName, lastName, email, phone, address } = req.body;
  const sql = "INSERT INTO contacts (firstName, lastName, email, phone, address) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [firstName, lastName, email, phone, address], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId });
  });
});

app.put('/contacts/:id', (req, res) => {
  const { firstName, lastName, email, phone, address } = req.body;
  const { id } = req.params;
  const sql = "UPDATE contacts SET firstName=?, lastName=?, email=?, phone=?, address=? WHERE id=?";
  db.query(sql, [firstName, lastName, email, phone, address, id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

app.delete('/contacts/:id', (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM contacts WHERE id=?", [id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
