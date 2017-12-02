require('dotenv').config();

const express    = require('express');
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const axios      = require('axios');
const async      = require('async');
const hbs        = require('express-handlebars');
const path       = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));

app.engine('hbs', hbs({
  defaultLayout: 'main',
  extname: 'hbs'
}));
app.set('view engine', 'hbs');

app.route('/')
  .get((req, res) => {
    res.render('home');
  })
  .post((req, res, next) => {
    const key = process.env.MAILCHIMP_KEY;
    const listId = process.env.MAILCHIMP_LIST_ID;

    axios.post(`https://us17.api.mailchimp.com/3.0/lists/${listId}/members`, {
      email_address: req.body.email,
      status: 'subscribed'
    }, {
      headers: {
        'Authorization': `randomUser ${key}`,
        'Content-Type': 'application/json'
      }
    })
      .then(() => res.redirect('/'))
      .catch(err => next(err));
  });

app.listen(PORT, err => {
  if (err) return console.log(err);
  console.log('Server listening on port', PORT);
});
