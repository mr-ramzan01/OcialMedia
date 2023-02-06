const app = require('./app');
const connection = require('./config/database');
const cloudinary = require('cloudinary')
const PORT = process.env.PORT || 8080;
const https = require('https')
const fs = require('fs');


const cert = fs.readFileSync('certificate.crt');
const key = fs.readFileSync('private.key');

const options = {
  key,
  cert
}

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

const { Server } = require("socket.io");

const httpServer = https.createServer(options, app);
const io = new Server(httpServer);


io.on("connection", (socket) => {

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected')
  })

  socket.on('join chat', (room) => {
    socket.join(room);
  })

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
   
  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat_id;
    if(!chat.users) return console.log('chat.users is not defined');

    chat.users.forEach(user => {
      if(user === newMessageReceived.sender._id) return;
      socket.in(user).emit('message received', newMessageReceived);
    })
  })

  socket.on("disconnect", () => {
    console.log('User disconnected');
  })

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });

})

const server = httpServer.listen(PORT, () => {
  try {
    console.log(`listening on port ${PORT}`);
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