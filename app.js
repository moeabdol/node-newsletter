require('dotenv').config();

const express    = require('express');
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const axios      = require('axios');
const async      = require('async');
const hbs        = require('express-handlebars');
const path       = require('path');
const session    = require('express-session');
const flash      = require('express-flash');
const MongoStore = require('connect-mongo')(session);

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

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SECRET,
  store: new MongoStore({ url: process.env.DB })
}));

app.use(flash());

app.route('/')
  .get((req, res) => {
    res.render('home', { message: req.flash('success') });
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
      .then(() => {
        req.flash('success', `You have successfully subscribed to the
          newsletter`);
        res.redirect('/');
      })
      .catch(err => next(err));
  });

app.listen(PORT, err => {
  if (err) return console.log(err);
  console.log('Server listening on port', PORT);
});
