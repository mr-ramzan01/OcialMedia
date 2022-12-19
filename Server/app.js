const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const handleError = require('./middlewares/Error.js');
const cookieParser = require('cookie-parser');
const userRouter = require('./routers/userRouter.js');


const app = express();

app.use(express.json());
app.use(cookieParser());
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

module.exports = app;