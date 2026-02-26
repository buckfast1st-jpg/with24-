import express from 'express';
import { createServer as createViteServer } from 'vite';
import { google } from 'googleapis';
import multer from 'multer';
import { Readable } from 'stream';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.get('/test', (req, res) => {
  res.send('Server is running');
});

app.use(express.json({ limit: '50mb' }));

// Google Auth Setup
let sheets: any = null;
let drive: any = null;

try {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file',
    ],
  });

  sheets = google.sheets({ version: 'v4', auth });
  drive = google.drive({ version: 'v3', auth });
} catch (error) {
  console.error('Failed to initialize Google Auth:', error);
}

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

// Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', googleAuth: !!sheets });
});

app.get('/api/config', async (req: any, res: any) => {
  if (!sheets || !SPREADSHEET_ID) {
    return res.status(503).json({ error: 'Google API not configured' });
  }
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A1',
    });
    
    if (response.data.values && response.data.values[0]) {
      res.json(JSON.parse(response.data.values[0][0]));
    } else {
      res.status(404).json({ error: 'Config not found' });
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
    
    if (process.env.GOOGLE_DRIVE_FOLDER_ID) {
      fileMetadata.parents = [process.env.GOOGLE_DRIVE_FOLDER_ID];
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
      console.warn('Could not set public permissions, file might not be viewable by everyone:', permError);
    }

    // Construct direct view link
    const directLink = `https://drive.google.com/uc?export=view&id=${file.data.id}`;
    res.json({ url: directLink, id: file.data.id });
  } catch (error: any) {
    console.error('Error uploading to Drive:', error);
    res.status(500).json({ error: error.message });
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
