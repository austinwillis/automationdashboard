var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var Table = require('easy-table');
var async = require('async');

var fs = require('fs');

var firebase = require('firebase');

var config = {
  apiKey: "AIzaSyCXhNpyDZ0XEbtySTgXg6fK-VFsYGk75eE",
  authDomain: "automationdashboard-f39b7.firebaseapp.com",
  databaseURL: "https://automationdashboard-f39b7.firebaseio.com",
  storageBucket: "automationdashboard-f39b7.appspot.com",
  messagingSenderId: "528345561369"
};

firebase.initializeApp(config);

var rootRef = firebase.database().ref();

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Google Sheets API.
  authorize(JSON.parse(content), generateReport);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function generateReport(auth) {
  var sheets = google.sheets('v4');
  var dates;
  var results;
  var tests;
  var suites;
  async.auto({
    one: function(callback) {
      sheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: '1NGaOYZRjhJLl3-2KAAqCKaEiJHmRcm4wa5oXC1jMeqk',
        range: 'AllResults!I9:AE1949',
      }, function(err, response) {
        results = response.values;
        callback(null, 1);
      });
    },
    suite: function(callback) {
      sheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: '1NGaOYZRjhJLl3-2KAAqCKaEiJHmRcm4wa5oXC1jMeqk',
        range: 'AllResults!D9:1949',
      }, function(err, response) {
        suites = response.values;
        callback(null, 2);
      });
    },
    two: function(callback) {
      sheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: '1NGaOYZRjhJLl3-2KAAqCKaEiJHmRcm4wa5oXC1jMeqk',
        range: 'AllResults!I1:AE1',
      }, function(err, response) {
        dates = response.values;
        callback(null, 2);
      });
    },
    three: function(callback) {
      sheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: '1NGaOYZRjhJLl3-2KAAqCKaEiJHmRcm4wa5oXC1jMeqk',
        range: 'AllResults!E9:E1949',
      }, function(err, response) {
        tests = response.values;
        callback(null, 3);
      });
    },
    final: ['one', 'suite', 'two', 'three', function(err, response) {
      var timestamps = [];
      for (let i = 0; i < dates[0].length; i++) {
        var myDate = dates[0][i].split("/");
        var newDate = myDate[0]+","+myDate[1]+","+myDate[2];
        timestamps.push(new Date(newDate).getTime());
      }

      var testnames = tests.map(test => {
        return test[0];
      })
      for (let v = 0; v < tests.length; v++) {
        var testname = tests[v][0].toString().replace('.', '_');
        firebase.database().ref(`/tests/${testname}/status`).set('Consistent');
        firebase.database().ref(`/tests/${testname}/suite`).set(suites[v][0]);
        firebase.database().ref(`/tests/${testname}/teamMember`).set('');
        for (let i = timestamps.length-1; i > -1; i--) {
          if (results[v][i] === 'PASS' || results[v][i] === 'FLAKE' || results[v][i] === 'FAIL' || results[v][i] === 'SKIP' || results[v][i] === 'BUG') {
            var dateObject = {};
            if (results[v][i] === 'PASS') {
              dateObject['result'] = 'PASSED';
            } else if (results[v][i] === 'FAIL') {
              dateObject['result'] = 'FAILED';
            } else if (results[v][i] === 'SKIP') {
              dateObject['result'] = 'SKIPPED';
            } else {
              dateObject['result'] = results[v][i];
            }
            dateObject['date'] = timestamps[i];
            dateObject['teamMember'] = '';
            dateObject['comment'] = '';
            firebase.database().ref(`/results/${testname}/`).push(dateObject);
            firebase.database().ref(`/tests/${testname}/lastResult`).set(dateObject);
          }
        }
      }
    }]
  });
}
