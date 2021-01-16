const firebase = require("./firebase_connect");

module.exports = {
    _getData: function(callback){
        firebase.database().ref("/").once("value").then(function(snapshot){
            
            callback(snapshot.child('student').child('userId').val());
        });
    },
    _getUserData: function(userId, callback){
        firebase.database().ref("/student").once("value").then(function(snapshot){
            
            callback(snapshot.val());
        });
    },
    _getStudent: function(role ,callback){
        // firebase.database().ref("/students").orderByChild("role").equalTo("user").once("value").then(snapshot =>{
        firebase.database().ref("/students").once("value").then(snapshot =>{
            
            return callback(snapshot.val().filter(ele => ele.role == role));
        })
    },
    _getUserById: function(userId, callback){
        firebase.database().ref("/students").once("value").then(snapshot => {
            return callback(snapshot.val().filter(ele => ele.studentId == userId));
        })
    },
    _getClass: function(className, callback){
        firebase.database().ref("/class").once("value").then(snapshot => {
            return callback(snapshot.child(className).val());
        })
    }
};