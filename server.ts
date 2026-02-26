import express from 'express';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;
const DATA_FILE = 'data.json';
const UPLOADS_DIR = 'uploads_data';

// Ensure data file and uploads dir exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ settings: null, uploads: [] }));
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

const getData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const saveData = (data: any) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

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
  res.json({ status: 'ok', storage: 'json' });
});

app.get('/api/config', (req, res) => {
  try {
    const data = getData();
    if (data.settings) {
      res.json(data.settings);
    } else {
      res.status(404).json({ error: 'Config not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/config', (req, res) => {
  try {
    const data = getData();
    data.settings = req.body;
    saveData(data);
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

    const fileId = Date.now().toString();
    const filename = `${fileId}-${req.file.originalname}`;
    const filePath = path.join(UPLOADS_DIR, filename);
    
    fs.writeFileSync(filePath, req.file.buffer);

    const data = getData();
    data.uploads.push({
      id: fileId,
      filename,
      original_name: req.file.originalname,
      mimetype: req.file.mimetype
    });
    saveData(data);

    const url = `/api/files/${fileId}`;
    res.json({ url, id: fileId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/files/:id', (req, res) => {
  try {
    const data = getData();
    const upload = data.uploads.find((u: any) => u.id === req.params.id);
    if (upload) {
      const filePath = path.join(UPLOADS_DIR, upload.filename);
      if (fs.existsSync(filePath)) {
        res.set('Content-Type', upload.mimetype);
        res.send(fs.readFileSync(filePath));
      } else {
        res.status(404).send('File not found on disk');
      }
    } else {
      res.status(404).send('File record not found');
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
