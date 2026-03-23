import app from './src/app.js';
import db from './src/config/database.js';

const PORT = 5000;

async function startServer(port = PORT) {
  try {
    // Only connect once
    if (port === PORT) {
      try {
        await db.$connect();
        console.log('✅ Database connected');
      } catch (dbError) {
        console.warn('⚠️  Database connection failed:', dbError.message);
      }
    }

    const server = app.listen(port, () => {
      console.log(`✅ Server running on port ${port}`);
      console.log(`📚 LMS API: http://localhost:${port}`);
      console.log(`🏥 Health: http://localhost:${port}/health`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        const nextPort = parseInt(port) + 1;
        process.stdout.write(`\r⚠️  Port ${port} is busy, trying ${nextPort}...\n`);
        startServer(nextPort);
      } else {
        console.error('❌ Server error:', err);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  try {
    await db.$disconnect();
  } catch (err) {}
  process.exit(0);
});

startServer();
