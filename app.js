const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const twilio = require('twilio');
const bodyParser = require('body-parser');
const http = require('http')

// Load configuration information from system environment constiables.
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// Create an authenticated client to access the Twilio REST API
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

// render our home page
app.get('/', function(req, res, next) {
  res.render('index');
});


app.post('/', (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse();

  if (req.body.Body == 'hello') {
    twiml.message('Hi!');
  } else if (req.body.Body == 'bye') {
    twiml.message('Goodbye');
  } else {
    twiml.message(
      'No Body param match, Twilio sends this in the request to your server.'
    );
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});

// handle a POST request to send a text message. 
// This is sent via ajax on our home page
app.post('/message', function(req, res, next) {
  // Use the REST client to send a text message
  client.messages.create({
    to: req.body.to,
    from: TWILIO_PHONE_NUMBER,
    body: 'Welcome to YourNews!'
  }).then(function(message) {
    // When we get a response from Twilio, respond to the HTTP POST request
    res.send('Message is inbound!');
  });
});

// handle a POST request to make an outbound call.
// This is sent via ajax on our home page
app.post('/call', function(req, res, next) {
  // Use the REST client to send a text message
  client.calls.create({
    to: req.body.to,
    from: TWILIO_PHONE_NUMBER,
    url: 'http://demo.twilio.com/docs/voice.xml'
  }).then(function(message) {
    // When we get a response from Twilio, respond to the HTTP POST request
    res.send('Call incoming!');
  });
});

app.post('/sms', function(req, res, next) {
  console.log("here")
  // Use the REST client to send a text message
  const twiml = new twilio.twiml.MessagingResponse();
  if (req.body.Body == 'Hello') twiml.message('Welcome!');
  else twiml.message('No Body param match, twilio sends this in the request to you server')
  res.writeHead(200, {'Content-Type': 'text/xml'});
  console.log(twiml.toString())
  res.end(twiml.toString());
});

// Create a TwiML document to provide instructions for an outbound call
app.post('/hello', function(req, res, next) {
  // Create a TwiML generator
  const twiml = new twilio.twiml.VoiceResponse();
  // const twiml = new twilio.TwimlResponse();
  twiml.say('Hello there! You have successfully configured a web hook.');
  twiml.say('Good luck on your Twilio quest!', { 
      voice:'woman' 
  });

  // Return an XML response to this request
  res.set('Content-Type','text/xml');
  res.send(twiml.toString());
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
