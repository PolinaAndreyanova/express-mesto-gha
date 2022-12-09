const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');

const { PORT = 3000 } = process.env;

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '63933ff9f739db757806103b',
  };

  next();
});

app.use(bodyParser.json());

app.use('/users', userRouter);

app.use('/cards', cardRouter);

mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
}, () => {
  console.log('Connected to MongoDB!');

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});
