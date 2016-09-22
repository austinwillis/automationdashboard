import { AngularFireModule, AuthMethods } from 'angularfire2';


const firebaseConfig = {
  apiKey: 'AIzaSyDC0gbiRrm9YXbG5No8-DdB2xAH6BUqXK4',
  authDomain: 'automato-9b898.firebaseapp.com',
  databaseURL: 'https://automato-9b898.firebaseio.com',
  storageBucket: 'automato-9b898.appspot.com',
  messagingSenderId: '707178478603'
};

const firebaseAuthConfig = {
  method: AuthMethods.Popup,
  remember: 'default'
};


export const FirebaseModule = AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig);
