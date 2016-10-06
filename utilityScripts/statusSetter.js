var firebase = require('firebase');

// var config = {
//   apiKey: "AIzaSyCXhNpyDZ0XEbtySTgXg6fK-VFsYGk75eE",
//   authDomain: "automationdashboard-f39b7.firebaseapp.com",
//   databaseURL: "https://automationdashboard-f39b7.firebaseio.com",
//   storageBucket: "automationdashboard-f39b7.appspot.com",
//   messagingSenderId: "528345561369"
// };
//
// firebase.initializeApp(config);

var firebaseConfig = {
  apiKey: 'AIzaSyDC0gbiRrm9YXbG5No8-DdB2xAH6BUqXK4',
  authDomain: 'automato-9b898.firebaseapp.com',
  databaseURL: 'https://automato-9b898.firebaseio.com',
  storageBucket: 'automato-9b898.appspot.com',
  messagingSenderId: '707178478603'
};

firebase.initializeApp({
  serviceAccount: "./resources/serviceAccountCreds.json",
  databaseURL: 'https://automato-9b898.firebaseio.com'
});

var rootRef = firebase.database().ref('results');

rootRef.once("value").then(function(snapshot) {
  var promiseArray = [];
  snapshot.forEach(function(childSnapshot) {
    var key = childSnapshot.key;
    var data = childSnapshot.val();
    var result = [];
    for(var k in data) {
      result.push(data[k]);
    }
    result.sort(function(a, b) {
    var aDate = new Date(a.date);
    var bDate = new Date(b.date);
    return aDate>bDate ? -1 : aDate<bDate ? 1 : 0;
    });

    if((1475582400000 - result[0].date) > 24*60*60*1000) {
      resultObject = {
        result: 'SKIPPED',
        date: 1475582400000 - (4*60*60*1000),
        comment: '',
        teamMember: ''
      }
      promiseArray.push(firebase.database().ref(`results/${key}`).push(resultObject));
    }

    if(result.length < 3) {
      promiseArray.push(firebase.database().ref(`tests/${key}/status`).set('Consistent'));
    } else if(result[0].result == "PASSED" && result[1].result == "PASSED" && result[2].result == "PASSED") {
      promiseArray.push(firebase.database().ref(`tests/${key}/status`).set('Consistent'));
    } else if(result[0].result != "PASSED" && result[1].result != "PASSED" && result[2].result != "PASSED") {
      promiseArray.push(firebase.database().ref(`tests/${key}/status`).set('Quarantine'));
    }
  });
  Promise.all(promiseArray).then(function() {
    process.exit(0);
  });
}).catch(function(error) {
  console.log(error.message);
});
