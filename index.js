const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

const db = require('./models');

const usersRouter = require('./routes/Users');
app.use('/auth', usersRouter);

const commentsRouter = require('./routes/Comments');
app.use('/comment', commentsRouter);

const postsRouter = require('./routes/Posts');
app.use('/post', postsRouter);

const likesRouter = require('./routes/Likes');
app.use('/like', likesRouter);

db.sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log('Server is Running on port', port);
    });
  })
  .catch((err) => {
    console.log('Error');
  });
