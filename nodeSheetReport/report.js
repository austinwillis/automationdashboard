var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var Table = require('easy-table');
var async = require('async');

var firebase = require('firebase');

var firebaseConfig = {
  apiKey: "AIzaSyCXhNpyDZ0XEbtySTgXg6fK-VFsYGk75eE",
  authDomain: "automationdashboard-f39b7.firebaseapp.com",
  databaseURL: "https://automationdashboard-f39b7.firebaseio.com",
  storageBucket: "automationdashboard-f39b7.appspot.com",
  messagingSenderId: "528345561369"
};

firebase.initializeApp(firebaseConfig);

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
  var t = new Table;
  var Quarantine = [];
  var Consistent = [];
  var data = [];
  async.auto({
    one: function(callback) {
      sheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: '1NGaOYZRjhJLl3-2KAAqCKaEiJHmRcm4wa5oXC1jMeqk',
        range: 'Consistent Tests!G2:G7',
      }, function(err, response) {
        if (err) {
          console.log('The API returned an error: ' + err);
          return;
        }
        var rows = response.values;
        if (rows.length == 0) {
          console.log('No data found.');
        } else {
          for (var i = 0; i < rows.length; i++) {
            Consistent.push(rows[i][0]);
          }
          callback(null, 1);
        }
      });
    },
    two: function(callback) {
      sheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: '1NGaOYZRjhJLl3-2KAAqCKaEiJHmRcm4wa5oXC1jMeqk',
        range: 'Quarantine!G2:G7',
      }, function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      var rows = response.values;
      if (rows.length == 0) {
        console.log('No data found.');
      } else {
        for (var i = 0; i < rows.length; i++) {
          Quarantine.push(rows[i][0]);
        }
        callback(null, 2);
        }
      });
    },
    final: ['one', 'two', function(err, results) {
      var results = [
        "Pass",
        "Flake",
        "Bug",
        "Fail",
        "Skip"
      ]
      var totalConsistent = parseFloat(Consistent[0]);
      var totalQuarantine = parseFloat(Quarantine[0]);
      for (var i = 1; i < Consistent.length; i++) {
        data.push({"result" : results[i-1], "consistent" : Consistent[i], "consistentPercent" : (parseFloat(Consistent[i]) / totalConsistent) * 100, "quarantine" :
        Quarantine[i], "quarantinePercent" : (parseFloat(Quarantine[i]) / totalQuarantine) * 100});
      }
      data.forEach(function(data) {
        t.cell('Result', data.result);
        t.cell('Consistent', parseInt(data.consistent), Table.padLeft)// + ' (' + data.consistentPercent.toFixed(1).toString() + '%' + ')', rightAlignPercent);
        t.cell('Quarantine', parseInt(data.quarantine), Table.padLeft)// + ' (' + data.quarantinePercent.toFixed(1).toString() + '%' + ')', rightAlignPercent);
        t.newRow();
      })
      t.total('Consistent', Table.padLeft);
      t.total('Quarantine', Table.padLeft);
      console.log(t.toString());
    }]
  });
}

function rightAlignPercent(val, width) {
  return Table.padLeft(val, width);
}
