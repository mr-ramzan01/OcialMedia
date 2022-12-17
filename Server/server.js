const express = require('express');
const connection = require('./config/database');
const cors = require('cors');
const userRouter = require('./routers/userRouter.js');
const morgan = require('morgan');
const handleError = require('./middlewares/Error.js');

const app = express();
app.use(express.json());
// app.use(morgan('tiny'));
app.use(cors());

app.get('/', (req, res) => {
  try {
    res.send("In home");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
})
app.use('/users', userRouter);
app.use(handleError);


app.get('*', (req, res) => {
  res.send("Invalid request");
})
app.listen(8080, () => {
  try {
    connection();
    console.log('listening on port 8080');
  } catch (error) {
    console.log('not listening');
  }  
})