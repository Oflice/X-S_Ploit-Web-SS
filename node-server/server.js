import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const AUTH_KEY = "X3D";
const COMMANDS_FILE = path.join(__dirname, 'commands.json');

// Initialize or repair commands file
function initCommandsFile() {
  try {
    if (!fs.existsSync(COMMANDS_FILE)) {
      fs.writeFileSync(COMMANDS_FILE, '[]', 'utf8');
      return [];
    }

    const content = fs.readFileSync(COMMANDS_FILE, 'utf8').trim();
    if (!content) {
      fs.writeFileSync(COMMANDS_FILE, '[]', 'utf8');
      return [];
    }

    return JSON.parse(content);
  } catch (err) {
    console.error('Repairing corrupted commands file');
    fs.writeFileSync(COMMANDS_FILE, '[]', 'utf8');
    return [];
  }
}

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Endpoints
app.get('/api/commands', (req, res) => {
  if (req.query.auth !== AUTH_KEY) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const commands = initCommandsFile();
    fs.writeFileSync(COMMANDS_FILE, '[]'); // Clear after reading
    res.json(commands);
  } catch (err) {
    console.error('Error handling /api/commands:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/api/commands', (req, res) => {
  if (req.body.auth !== AUTH_KEY) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const commands = initCommandsFile();
    commands.push({
      id: Date.now(),
      code: req.body.code
    });
    fs.writeFileSync(COMMANDS_FILE, JSON.stringify(commands, null, 2), 'utf8');
    res.json({ success: true });
  } catch (err) {
    console.error('Error handling POST /api/commands:', err);
    res.status(500).json({ error: "Failed to save command" });
  }
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`
  🚀 Server ready at http://localhost:${PORT}
  🔑 Auth Key: ${AUTH_KEY}
  📁 Web interface: http://localhost:${PORT}
  `);
  initCommandsFile(); // Initialize on startup
});