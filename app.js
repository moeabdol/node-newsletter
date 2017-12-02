const express    = require('express');
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const axios      = require('axios');
const async      = require('async');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));

app.listen(PORT, err => {
  if (err) return console.log(err);
  console.log('Server listening on port', PORT);
});
