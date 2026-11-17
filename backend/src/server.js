require('dotenv').config();
const http = require('http');

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Service Snaps backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error('PostgreSQL connection error:', error.message);
    process.exit(1);
  }
};

startServer();

