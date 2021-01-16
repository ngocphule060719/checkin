const firebase = require("firebase");

const app = firebase.initializeApp({
    //  apiKey: "AIzaSyCYx3OuMOwLQbKifAqD-PdcvRd_HMFJX6E",
    //  authDomain: "do-an-2-f996c.firebaseapp.com",
    //  databaseURL: "https://do-an-2-f996c.firebaseio.com"

    apiKey: "AIzaSyCYx3OuMOwLQbKifAqD-PdcvRd_HMFJX6E",
    authDomain: "do-an-2-f996c.firebaseapp.com",
    databaseURL: "https://do-an-2-f996c.firebaseio.com",
    projectId: "do-an-2-f996c",
    storageBucket: "do-an-2-f996c.appspot.com",
    messagingSenderId: "762328063987",
    appId: "1:762328063987:web:2754423c3a26ed2cbb3c86",
    measurementId: "G-C9FYPVKG71"
});

var auth = app.auth();

module.exports = app;