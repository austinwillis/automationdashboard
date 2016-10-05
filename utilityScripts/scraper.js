var rp = require('request-promise');
var firebase = require('firebase');

firebase.initializeApp({
  serviceAccount: "./resources/serviceAccountCreds.json",
  databaseURL: 'https://automato-9b898.firebaseio.com'
});

var rootRef = firebase.database().ref('suites');

var findDate = function(line) {
  return new Date((line.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)[0]).split(' ').join('T')).getTime();
};

var findTestname = function (line) {
  return line.match(/\w+\.\w+/ig)[0];
};

var findResult = function (line) {
  return line.match(/TEST (\w+):/)[1];
};

var getResult = function(data) {
  var lines = data.split("\n").filter(function(line) {
    return /-Dsuite=\w+/.test(line);
  })[0];
  var suite = lines.match(/-Dsuite=\w+/)[0].replace("-Dsuite=","");
  var user = lines.match(/-DUSER_ID=\w+/)[0].replace("-DUSER_ID=","");

  return data.split("\n")
    .filter(function(line) {
      return /TEST (FAILED|PASSED|SKIPPED)/.test(line);
    }).map(function(line) {
      return {
        "user": user,
        "suite": suite,
        "date": findDate(line),
        "testName": findTestname(line),
        "result": findResult(line)
      };
    });
  };

rootRef.once("value")
  .then(function(data) {
    var requests = data.val().map(function (suite) {
      return rp({ url:`${suite.url}/lastBuild/consoleText`, json:true });
    });
    var inserts = [];
    Promise.all(requests).then(function(responses) {
      var results = responses.reduce(function(result, data) {
        return result.concat(getResult(data));
      },[]);
      var resultsWithoutDuplicates = [];
      for (let i = 0; i < results.length - 1; i++) {
        if (results[i].testName !== results[i+1].testName) {
          resultsWithoutDuplicates.push(results[i]);
        }
      }
      resultsWithoutDuplicates.push(results[results.length-1]);

      results.forEach(function(result) {
        var testName = result.testName.replace(".","_");
        var dateObject = {};
        dateObject['user'] = result.user;
        dateObject['result'] = result.result;
        dateObject['date'] = result.date;
        dateObject['teamMember'] = "";
        inserts.push(firebase.database().ref(`results/${testName}`).push(dateObject));
        inserts.push(firebase.database().ref(`tests/${testName}/lastResult`).set(dateObject));
        inserts.push(firebase.database().ref(`tests/${testName}/teamMember`).set(""));
        inserts.push(firebase.database().ref(`tests/${testName}/suite`).set(result.suite));
      });
      Promise.all(inserts).then(function(insert) {
        process.exit(0);
      });
      console.log(Array.from(new Set(results.map(item=>item["testName"]))).length);
    },function(reject) {
      console.log(reject);
    });
  }).catch(function(error) {
    console.log(error.message);
  });
