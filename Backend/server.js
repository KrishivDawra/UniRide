require('dotenv').config();
const http = require('http');
const app = require('./App');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();
    console.log("MongoDB Connected Successfully");

    // Create HTTP Server
    const server = http.createServer(app);

    // Start Server
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
