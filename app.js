require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true})

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        reuired: [true]
    },
    password: {
        type: String,
        required: [true]
    }
})

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:["password"]})

const User = mongoose.model("User", userSchema)

app.get("/", function(req, res){
    res.render("home")
})

app.route("/login")

    .get(function(req, res){
    res.render("login")
})
    .post(function(req, res){
     const userName = req.body.username
     const password = req.body.password
     User.findOne({email: userName}, function(err, foundUser){
         if (!err) {
             if(foundUser){
                 if(foundUser.password === password){
                     res.render("secrets")
                 }
             }
         } else {
             console.log(err);
         }
     })
 });

app.get("/register", function(req, res){
    res.render("register")
})

app.post("/register", function(req, res){
    const email = req.body.username
    const password = req.body.password
    const newUser = new User({
        email: email,
        password: password
    })
    newUser.save(function(err){
        if (!err) {
            res.render("secrets")
        } else {
            console.log(err);
        }
    })
})














app.listen(3000, function(){
    console.log("server started at port 3000");
    
})