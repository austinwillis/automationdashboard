var firebase = require("firebase");
var Table = require('easy-table');
var Slack = require('slack-node');

var creds = require('./resources/slackCreds.json');

var firebaseConfig = {
  apiKey: 'AIzaSyDC0gbiRrm9YXbG5No8-DdB2xAH6BUqXK4',
  authDomain: 'automato-9b898.firebaseapp.com',
  databaseURL: 'https://automato-9b898.firebaseio.com',
  storageBucket: 'automato-9b898.appspot.com',
  messagingSenderId: '707178478603'
};

var getCount = function(array, comparitor) {
  return array.filter(function(item) {
    return item === comparitor;
  });
};

firebase.initializeApp({
  serviceAccount: "./resources/serviceAccountCreds.json",
  databaseURL: 'https://automato-9b898.firebaseio.com'
});

var rootRef = firebase.database().ref('results');

rootRef.once("value").then(function (data) {
  var currentDay = [];
  var previousDay = [];
  data.forEach(function(item) {
    var key = item.key;
    var value = item.val();
    var result = [];
    for(var k in value) {
      result.push(value[k]);
    }
    result.sort(function(a, b) {
      var aDate = new Date(a.date);
      var bDate = new Date(b.date);
      return aDate>bDate ? -1 : aDate<bDate ? 1 : 0;
    });
    if(result.length > 1) {
      currentDay.push(result[0].result);
      previousDay.push(result[1].result);
    } else {
      currentDay.push(result[0].result);
    }
  });
  var reportData = [];
  reportData.push({'currentName':'Pass','currentCount':getCount(currentDay, "PASSED").length,'previousCount':getCount(previousDay,"PASSED").length,'delta':(getCount(currentDay, "PASSED").length-getCount(previousDay,"PASSED").length)});
  reportData.push({'currentName':'Fail','currentCount':getCount(currentDay, "FAILED").length,'previousCount':getCount(previousDay,"FAILED").length,'delta':(getCount(currentDay, "FAILED").length-getCount(previousDay,"FAILED").length)});
  reportData.push({'currentName':'Flake','currentCount':getCount(currentDay, "FLAKE").length,'previousCount':getCount(previousDay,"FLAKE").length,'delta':(getCount(currentDay, "FLAKE").length-getCount(previousDay,"FLAKE").length)});
  reportData.push({'currentName':'Skip','currentCount':getCount(currentDay, "SKIPPED").length,'previousCount':getCount(previousDay,"SKIPPED").length,'delta':(getCount(currentDay, "SKIPPED").length-getCount(previousDay,"SKIPPED").length)});
  reportData.push({'currentName':'Bug','currentCount':getCount(currentDay, "BUG").length,'previousCount':getCount(previousDay,"BUG").length,'delta':(getCount(currentDay, "BUG").length-getCount(previousDay,"BUG").length)});

  var table = new Table();

  reportData.forEach(function (data) {
    table.cell('Result', data.currentName, Table.padLeft);
    table.cell('Current Run', data.currentCount, Table.padLeft);
    table.cell('%',((data.currentCount/currentDay.length)*100).toFixed(2), Table.padLeft);
    table.cell('Last Run', data.previousCount, Table.padLeft);
    table.cell('% ',((data.previousCount/previousDay.length)*100).toFixed(2), Table.padLeft);
    table.cell('Delta',data.delta, Table.padLeft);
    table.newRow();
  });

  table.total('Current Run', {
    reduce: Table.aggr.total,
    init: 0
  });
  table.total('Last Run', {
    reduce: Table.aggr.total,
    init: 0
  });
  table.total('Delta', {
    reduce: Table.aggr.total,
    init: 0
  });

  var slack = new Slack(creds.key);

  console.log(slack);

  slack.api("users.list", function(err, response) {
    console.log(response);
  });

  slack.api("chat.postMessage", {
    text:'*Daily Regression Report* \n' + '```' + table.toString() + '```',
    channel: 'the-automan-empire',
    username: 'autobot'
  }, function(err, response) {
    process.exit(0);
  });

}).catch(function (error) {
  console.log(error.message);
});
