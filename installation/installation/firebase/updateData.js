const firebase = require("./firebase_connect");

module.exports = {
    _updateData: function(req, callback){
        let username = req.username;
        let email = req.email;

        firebase.database().ref("/users/"+username).update({
            email: email
        });
        callback("success");
    }

}