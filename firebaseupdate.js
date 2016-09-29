var firebase = require('firebase');

var firebaseConfig = {
  apiKey: 'AIzaSyDC0gbiRrm9YXbG5No8-DdB2xAH6BUqXK4',
  authDomain: 'automato-9b898.firebaseapp.com',
  databaseURL: 'https://automato-9b898.firebaseio.com',
  storageBucket: 'automato-9b898.appspot.com',
  messagingSenderId: '707178478603'
};

firebase.initializeApp(firebaseConfig);

var rootRef = firebase.database().ref();

var tests = [];

var testsref = firebase.database().ref('/tests');

testsref.once("value")
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      // key will be "ada" the first time and "alan" the second time
      firebase.database().ref(`/tests/${childSnapshot.key}/status`).set('Consistent');
  });
});
