const firebase = require("./firebase_connect");

module.exports = {
    saveData: function(req, callback){
        let username = req.username;

        firebase.database().ref("users/"+ username).set({
            name: req.username,
            email: req.email
        });
        callback(null,{
            "status:code":200,
            "message":"Inserted successfully"
        });
    }

};