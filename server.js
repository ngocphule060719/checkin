const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const ofirebase = require("./firebase/setData");
const ogetData = require("./firebase/getData");
const updateData = require("./firebase/updateData");
const deleteData = require("./firebase/deleteData");


const session = require('express-session');
const bcrypt = require('bcrypt');

const saltRounds = 10;

// app.set('view engine', 'ejs');
app.engine("html", require('ejs').renderFile)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'somesecret',
    cookie: {maxAge: 60000000000000000000}
}))
app.get("/", (req, res) =>{
    res.render("login.html");
})
app.post("/login", checkPassword, (req, res) =>{
    if(req.role == "admin"){
        res.redirect("/admin");
    }else{
        res.redirect("/profile")
    }
    // console.log(req.isAd);
    // res.redirect("/profile");
})

app.get("/sessionLogout", (req, res) => {
    req.session.destroy((err) =>{
        res.redirect("/");
    })
    
});

app.get("/profile",checkLoggin,  (req, res) =>{
    var {user} = req.session; //user = req.session.user
    var userData = {};
    //var classInfo = getClass(user.class);

    // console.log(classInfo.time);
    userData.dayCheckIn = user.checkIn.map(element =>{
        var splited = element.split(" ");
        return splited[1];//get day
        
    })
    userData.timeCheckIn = user.checkIn.map(element =>{
        var splited = element.split(" ");
        return splited[0];//get day
    })
    getClass(user.class)
    .then(val =>{
        res.render("profile.ejs", {
            data: user,
            dayCheckIn: userData.dayCheckIn,
            timeCheckIn: userData.timeCheckIn,
            schedule: val.schedule,
            time: val.time,
            stdName: req.session.user.name
        });
    })
    
})


app.get("/admin",checkLoggin ,isAdmin ,  (req, res) =>{
    var getCl = new Promise((resolve, reject) =>{
        ogetData._getClass("A", data => resolve(data));
    });
    var getStd = new Promise((resolve, reject) =>{
        ogetData._getStudent("student", data => resolve(data));
    })
    Promise.all([getCl, getStd])
    .then(val => {//includes class and student info in arr
        cls = val[0];//class
        studentList = val[1];
        var output = {};
        output = cls.schedule.map((day, idx) =>{
            presentStudent = [];
            absentStudent = [];
            studentList.forEach(std => {
                dayTimeArr = std.checkIn;
                onlyDayArr = dayTimeArr.map(dayTime => dayTime.split(" ")[1]);
                if(onlyDayArr.includes(day))presentStudent.push(std);
                else absentStudent.push(std);
            });
            return {
                day,//"day": day
                presentStudent,
                absentStudent
            };
        })
        res.render("admin.ejs", {
            userInfo: val[1],
            pointList: output,
            adName: req.session.user.name
        })
    })
    // getStudent()
    // .then(val => {
    //     console.log(val);
    //     res.render("admin.ejs", {
    //         userInfo: val
    //     });
    // })
    // .catch(() =>{
    //     console.log("Loi roiiii");
    // })
})

app.get("/403error", (req, res) =>{
    res.render("error/403.html")
})

app.listen(port, function(err,data){
    if(err) console.log(err);
    else console.log("connected");
});

app.post("/savedata/", function(req){
    ofirebase.saveData(req.body, function(err,data){
        resizeBy.send(data);
    });
});

// create end point and get data

app.get("/userData/", function(req,res){
    ogetData._getData(function(data){
        // console.log(data.student[1].password);
    });
});

//update data

app.put("/userData/", function(req,res){
    updateData._updateData(req.body, function(data){
        res.send({
            "status":200,
            "statuscode": "1",
            "message": "update successfully"
        });
    });
});

//delete data

app.delete("/userData/", function(req,res){
    deleteData._deleteUserData(function(data){
        res.send({
            "status": 200,
            "statuscode": "1",
            "message": "delete successfully"
        })
    })

});


function checkPassword(req, res, next){
    ogetData._getUserById(req.body.username, data =>{
        if(data && bcrypt.compareSync(req.body.password, data[0].password)){
            var ses = req.session;
            ses.user = data[0];
            req.role = data[0].role;
            next();
        }else{
            res.redirect("/");
        }
    });
}


function checkLoggin(req, res, next){
    if(!req.session.user){
        res.redirect("/")
    }
    else next();
}

function isAdmin(req, res, next){
    if(req.session.user.role == "admin"){
        next();
    }
    else{
        res.redirect("/403error");
    }
}

function hash_password(password){
    let saltRound = 10;
    let salt = bcrypt.genSaltSync(saltRound);
    let hash = bcrypt.hashSync(password, salt);
    return hash;
}

function hash2(pw){
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(pw, salt, function(err, hash) {
            // Store hash in your password DB.
        });
    });
}


function getClass(className){
    return new Promise((resolve, reject) =>{
        ogetData._getClass(className, data => resolve(data));
    })
}

function getStudent(){
    return new Promise((resolve, reject) =>{
        ogetData._getStudent("student", data => resolve(data));
    })
}
