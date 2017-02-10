'use strict';

const express = require('express');
const chalk = require('chalk');
const configServer = require('./configure');
const app = express();

const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const AuthorizationV1 = require('watson-developer-cloud/authorization/v1');

configServer(app);

const stt = new SpeechToTextV1({
  // if left undefined, username and password to fall back to the SPEECH_TO_TEXT_USERNAME and
  // SPEECH_TO_TEXT_PASSWORD environment properties, and then to VCAP_SERVICES (on Bluemix)
  username: '',
  password: ''
});

const authService = new AuthorizationV1(stt.getCredentials());

// Get token using your credentials
app.get('/api/token', function(req, res, next) {
  authService.getToken(function(err, token) {
    if (err) {
      next(err);
    } else {
      res.send(token);
    }
  });
});

app.get('/*', (req, res) => {
  res.sendFile(app.getValue('indexPath'));
});

app.use((err, req, res, next) => {
  console.error(err, typeof next);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

module.exports = app;
