const firebase = require("./firebase_connect");

module.exports = {
    _deleteUserData: function(callback){
        firebase.database().ref("users/").remove();
        callback("success");
    }

}