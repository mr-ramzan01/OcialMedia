const app = require('./app');
const connection = require('./config/database');
const cloudinary = require('cloudinary')
const PORT = process.env.PORT || 8080;


// Uncaught Error Handler
process.on('uncaughtException', (err) => {
  console.log({ error: err.message, message: "Server Shutdown due to Uncaught error" });
  process.exit(1);
})


connection();


// cloudinary setup configs 
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})


const server = app.listen(PORT, () => {
  try {
    console.log('listening on port 8080');
  } catch (error) {
    console.log('not listening');
  }  
})


// Unhandled Promise Rejection
process.on("unhandledRejection", err => {
  console.log("Error: " + err.message);
  console.log("Closing the server due to unhandledPromiseRejection");

  server.close(() => {
      process.exit(1);
  })
})