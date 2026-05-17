require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { initDatabase } = require('./models/database');

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const topicRoutes = require('./routes/topicRoutes');
const noteRoutes = require('./routes/noteRoutes');
const aiRoutes = require('./routes/aiRoutes');
const examRoutes = require('./routes/examRoutes');
const adminRoutes = require('./routes/adminRoutes');
const flashcardRoutes = require('./routes/flashcardRoutes');
const knowledgeRoutes = require('./routes/knowledgeRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { error: 'Too many requests, please try again later.' }
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
const staticOptions = process.env.NODE_ENV !== 'production' 
  ? { setHeaders: (res) => res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private') }
  : {};
app.use(express.static(path.join(__dirname, 'public'), staticOptions));

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/knowledge', knowledgeRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'LexPrep AI is running', timestamp: new Date().toISOString() });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(notFound);
app.use(errorHandler);

let server;

async function startServerWithRetry(port, maxRetries = 5) {
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`\x1b[32m✔ LexPrep AI server running on http://localhost:${port}\x1b[00m`);
      console.log(`\x1b[36mℹ Health check: http://localhost:${port}/api/health\x1b[00m`);
      resolve(server);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`\x1b[33m⚠️ Port ${port} is already in use.\x1b[00m`);
        
        const isDev = process.env.NODE_ENV !== 'production';
        const fallbackEnabled = process.env.PORT_FALLBACK !== 'false'; // Enabled by default in dev unless explicitly disabled
        
        if (isDev && fallbackEnabled && maxRetries > 0) {
          const nextPort = parseInt(port) + 1;
          console.log(`\x1b[36m🔄 Dev mode fallback: Attempting to bind to port ${nextPort}...\x1b[00m`);
          resolve(startServerWithRetry(nextPort, maxRetries - 1));
        } else {
          console.error(`\x1b[31m✘ Error: Could not bind to port ${port}. Max retries reached or fallback disabled.\x1b[00m`);
          console.error(`\x1b[33m💡 Fix: Run 'npm run clean-port' or use PowerShell to kill the process on port ${port}.\x1b[00m`);
          reject(err);
        }
      } else {
        console.error('\x1b[31m✘ Server error:\x1b[00m', err);
        reject(err);
      }
    });
  });
}

async function start() {
  try {
    await initDatabase();
    console.log('\x1b[32m✔ Database initialized successfully\x1b[00m');
    
    await startServerWithRetry(PORT);
    setupGracefulShutdown();
  } catch (err) {
    console.error('\x1b[31m✘ Failed to start server gracefully:\x1b[00m', err);
    process.exit(1);
  }
}

function setupGracefulShutdown() {
  const shutdown = async (signal) => {
    console.log(`\n\x1b[33m⚠️ Received ${signal}. Shutting down gracefully...\x1b[00m`);
    
    // Close the Express server to stop accepting new connections
    if (server) {
      server.close(() => {
        console.log('\x1b[32m✔ HTTP server closed.\x1b[00m');
        // Add database connection cleanup here if applicable
        process.exit(0);
      });

      // Force shutdown if it takes too long
      setTimeout(() => {
        console.error('\x1b[31m✘ Forcefully terminating due to timeout during shutdown.\x1b[00m');
        process.exit(1);
      }, 10000).unref();
    } else {
      process.exit(0);
    }
  };

  // Standard signals
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  
  // Nodemon uses SIGUSR2 to restart
  process.on('SIGUSR2', () => {
    console.log(`\n\x1b[33m⚠️ Received SIGUSR2 (Nodemon restart). Shutting down gracefully...\x1b[00m`);
    if (server) {
      server.close(() => {
        console.log('\x1b[32m✔ HTTP server closed for restart.\x1b[00m');
        process.kill(process.pid, 'SIGUSR2');
      });
    } else {
      process.kill(process.pid, 'SIGUSR2');
    }
  });

  // Catch unhandled rejections to prevent zombie processes
  process.on('unhandledRejection', (reason, promise) => {
    console.error('\x1b[31m✘ Unhandled Rejection at:\x1b[00m', promise, 'reason:', reason);
    shutdown('UNHANDLED_REJECTION');
  });
}

start();

module.exports = app;
