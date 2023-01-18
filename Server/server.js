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


const io = require('socket.io')(server, {
  pingTimeout: 30000,
  cors: {
    origin: 'http://localhost:3000'
  }
})

io.on('connection', (socket) => {
  console.log('connected to socket.io');

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected')
  })

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('user joined room: ' + room);
  })

  socket.on('new message', (newMessageReceived) => {
    console.log('new message received: ' + newMessageReceived);
    let chat = newMessageReceived.chat_id;
    if(!chat.users) return console.log('chat.users is not defined');

    chat.users.forEach(user => {
      console.log(newMessageReceived.sender._id);
      if(user === newMessageReceived.sender._id) return;
      socket.in(user).emit('message received', newMessageReceived);
    })
  })

})


// Unhandled Promise Rejection
process.on("unhandledRejection", err => {
  console.log("Error: " + err.message);
  console.log("Closing the server due to unhandledPromiseRejection");

  server.close(() => {
      process.exit(1);
  })
})