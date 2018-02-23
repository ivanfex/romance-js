import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyBvsnEF54GXUbZ1mtsIfGTEZWO5PXd20Gc",
    authDomain: "romance-js.firebaseapp.com",
    databaseURL: "https://romance-js.firebaseio.com",
    projectId: "romance-js",
    storageBucket: "romance-js.appspot.com",
    messagingSenderId: "418150266396"
  };
  firebase.initializeApp(config);

export default firebase;
