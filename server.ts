import express from 'express';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;
const db = new Database('data.db');

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY,
    config TEXT
  );
  CREATE TABLE IF NOT EXISTS uploads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT,
    original_name TEXT,
    mimetype TEXT,
    data BLOB
  );
`);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: 'sqlite' });
});

app.get('/api/config', (req, res) => {
  try {
    const row = db.prepare('SELECT config FROM settings WHERE id = 1').get() as any;
    if (row) {
      res.json(JSON.parse(row.config));
    } else {
      res.status(404).json({ error: 'Config not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/config', (req, res) => {
  try {
    const config = JSON.stringify(req.body);
    const exists = db.prepare('SELECT id FROM settings WHERE id = 1').get();
    if (exists) {
      db.prepare('UPDATE settings SET config = ? WHERE id = 1').run(config);
    } else {
      db.prepare('INSERT INTO settings (id, config) VALUES (1, ?)').run(config);
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/upload', upload.single('file'), (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const info = db.prepare('INSERT INTO uploads (filename, original_name, mimetype, data) VALUES (?, ?, ?, ?)').run(
      `${Date.now()}-${req.file.originalname}`,
      req.file.originalname,
      req.file.mimetype,
      req.file.buffer
    );

    const fileId = info.lastInsertRowid;
    const url = `/api/files/${fileId}`;
    res.json({ url, id: fileId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/files/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT data, mimetype FROM uploads WHERE id = ?').get(req.params.id) as any;
    if (row) {
      res.set('Content-Type', row.mimetype);
      res.send(row.data);
    } else {
      res.status(404).send('File not found');
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

// Vite middleware for development
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
