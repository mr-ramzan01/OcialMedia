const app = require('./app');
const connection = require('./config/database');
const PORT = 8080;

app.listen(PORT, () => {
  try {
    connection();
    console.log('listening on port 8080');
  } catch (error) {
    console.log('not listening');
  }  
})