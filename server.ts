import express from 'express';
import { createServer as createViteServer } from 'vite';
import { google } from 'googleapis';
import multer from 'multer';
import { Readable } from 'stream';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Google Auth Setup
let sheets: any = null;
let drive: any = null;
let authError: string | null = null;

try {
  let privateKey = process.env.GOOGLE_PRIVATE_KEY || '';
  
  // 1. Remove surrounding quotes if they exist
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.substring(1, privateKey.length - 1);
  }
  
  // 2. Replace escaped newlines with actual newlines
  privateKey = privateKey.replace(/\\n/g, '\n');

  // 3. Ensure the key has the correct header and footer if it somehow got stripped
  if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
    privateKey = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----\n`;
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: privateKey,
    },
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive', // broader scope for drive
    ],
  });

  sheets = google.sheets({ version: 'v4', auth });
  drive = google.drive({ version: 'v3', auth });
  console.log('Google APIs initialized successfully');
} catch (error: any) {
  console.error('Failed to initialize Google Auth:', error);
  authError = error.message;
}

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

// Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', googleAuth: !!sheets, authError });
});

app.get('/api/config', async (req: any, res: any) => {
  if (!sheets || !SPREADSHEET_ID) {
    return res.status(503).json({ error: `Google API not configured. Auth Error: ${authError}` });
  }
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A1',
    });
    
    if (response.data.values && response.data.values[0] && response.data.values[0][0]) {
      res.json(JSON.parse(response.data.values[0][0]));
    } else {
      res.status(404).json({ error: 'Config not found in spreadsheet' });
    }
  } catch (error: any) {
    console.error('Error fetching config:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/config', async (req: any, res: any) => {
  if (!sheets || !SPREADSHEET_ID) {
    return res.status(503).json({ error: 'Google Sheets API not configured' });
  }
  try {
    const config = req.body;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[JSON.stringify(config)]],
      },
    });
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error saving config:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/upload', upload.single('file'), async (req: any, res: any) => {
  if (!drive) {
    return res.status(503).json({ error: 'Google Drive API not configured' });
  }
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);

    const fileMetadata: any = {
      name: `${Date.now()}-${req.file.originalname}`,
    };
    
    if (DRIVE_FOLDER_ID) {
      fileMetadata.parents = [DRIVE_FOLDER_ID];
    }

    const media = {
      mimeType: req.file.mimetype,
      body: bufferStream,
    };

    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    // Make file public
    try {
      await drive.permissions.create({
        fileId: file.data.id!,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
    } catch (permError) {
      console.warn('Could not set public permissions:', permError);
    }

    const directLink = `https://drive.google.com/uc?export=view&id=${file.data.id}`;
    res.json({ url: directLink, id: file.data.id });
  } catch (error: any) {
    console.error('Error uploading to Drive:', error);
    res.status(500).json({ error: error.message });
  }
});

// Catch-all for API routes that aren't matched
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Unhandled error:', err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err.message || 'Internal Server Error' });
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
