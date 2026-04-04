require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const { initializeSocket } = require('./socket/socketHandler');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(express.json());
app.use(cors({
  origin: CLIENT_URL,
  methods: ['GET', 'POST']
}));

// REST Routes
app.use('/api', aiRoutes);

// PDF Upload Storage Route
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { setPdfContext } = require('./services/geminiService');

const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/upload-pdf', upload.single('pdfFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No PDF file uploaded.' });
    }

    const dataBuffer = req.file.buffer;
    const data = await pdfParse(dataBuffer);
    
    // Store in global memory state
    setPdfContext(data.text);

    return res.json({ 
      success: true, 
      message: 'PDF parsed and stored as context successfully.', 
      pages: data.numpages, 
      length: data.text.length 
    });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    res.status(500).json({ 
      success: false, 
      message: `Failed to process PDF file. Error: ${error.message}` 
    });
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// HTTP Server
const server = http.createServer(app);

// Socket.io Server Setup
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

// Initialize real-time socket events
initializeSocket(io);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
