// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Assuming 'public' contains your static assets (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));
// Assuming you have EJS templates in a 'views' directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const DB_CONFIG = {
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'portfolio_db',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10
};

let pool;

/**
 * Sleep helper
 */
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Ensure DB server is reachable, create database if missing, and seed if necessary
 */
async function ensureDatabaseReady() {
  const adminConfig = {
    host: DB_CONFIG.host,
    user: DB_CONFIG.user,
    password: DB_CONFIG.password,
    port: DB_CONFIG.port,
    multipleStatements: true,
  };

  // Try to connect repeatedly until MySQL is accepting connections
  const maxAttempts = 30;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const adminConn = await mysql.createConnection(adminConfig);
      console.log('Connected to MySQL server (admin). Ensuring database exists...');
      await adminConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\``);
      await adminConn.end();
      // Now create a pool that connects to the database
      pool = mysql.createPool(DB_CONFIG);
      // Run idempotent seed / schema check
      await applySeedsIfNeeded();
      return;
    } catch (err) {
      console.log(`MySQL not ready (attempt ${attempt}/${maxAttempts}): ${err.code || err.message}`);
      await wait(2000);
    }
  }
  throw new Error('MySQL did not become ready in time');
}

/**
 * Check if tables exist and apply init.sql schema/seeds if necessary.
 */
async function applySeedsIfNeeded() {
  try {
    // ensure pool is available
    if (!pool) pool = mysql.createPool(DB_CONFIG);

    // Check if projects table exists
    const [rows] = await pool.query("SELECT COUNT(*) AS cnt FROM information_schema.tables WHERE table_schema = ? AND table_name = 'projects'", [DB_CONFIG.database]);
    const exists = rows && rows[0] && rows[0].cnt > 0;

    if (!exists) {
      console.log('projects table does not exist: applying init.sql from project root');
      // read init.sql and execute using a connection with multipleStatements
      const sql = await fs.readFile(path.join(__dirname, 'init.sql'), 'utf8');
      const conn = await mysql.createConnection({ 
        host: DB_CONFIG.host,
        user: DB_CONFIG.user,
        password: DB_CONFIG.password,
        port: DB_CONFIG.port,
        multipleStatements: true
      });
      // Ensure we are working in the target DB
      await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\``);
      await conn.query(`USE \`${DB_CONFIG.database}\``);
      await conn.query(sql);
      await conn.end();
      console.log('init.sql applied successfully');
    } else {
      // Table exists; check if projects table is empty and insert seeds if so
      const [r2] = await pool.query('SELECT COUNT(*) AS c FROM projects');
      if (r2 && r2[0] && r2[0].c === 0) {
        console.log('projects table present but empty - inserting seed rows');
        await pool.query(
          `INSERT INTO projects (title, description, image, link)
           VALUES
           (?, ?, ?, ?),
           (?, ?, ?, ?),
           (?, ?, ?, ?)`,
          [
            'Cloud Infra Automation','Automated infra provisioning with Terraform and CI/CD.','images/cloud_infra.svg','#',
            'Real-time Monitoring','Monitoring solution using Prometheus & Grafana.','images/monitoring.svg','#',
            'Serverless App','Serverless file processing app on AWS Lambda.','images/serverless.svg','#'
          ]
        );
        console.log('Seed rows inserted');
      } else {
        console.log('projects table exists and has data; no seed needed');
      }
    }
  } catch (err) {
    console.warn('applySeedsIfNeeded encountered an error:', err.message || err);
    throw err;
  }
}

// --- Routes ---
app.get('/', (req, res) => res.render('index'));
app.get('/about', (req, res) => res.render('about'));
app.get('/services', (req, res) => res.render('services'));

app.get('/portfolio', async (req, res) => {
  try {
    const [projects] = await pool.query('SELECT * FROM projects ORDER BY id DESC');
    res.render('portfolio', { projects });
  } catch (err) {
    console.error(err);
    res.status(500).send('DB error');
  }
});

app.get('/contact', (req, res) => res.render('contact'));

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });
  try {
    const [result] = await pool.execute(
      'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
      [name, email, message || null]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.use((req, res) => res.status(404).render('404'));

// Start initialization and server
(async () => {
  try {
    await ensureDatabaseReady();
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (err) {
    console.error('Failed to initialize database or start server:', err);
    process.exit(1);
  }
})();
