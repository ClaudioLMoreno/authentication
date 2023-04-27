require("dotenv").config()
const express=require("express")
const bodyParser=require("body-parser")
const ejs=require("ejs")
const mongoose=require("mongoose")
const encrypt=require("mongoose-encryption")
const app=express()

app.use(express.static("publid"))
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect('mongodb://127.0.0.1:27017/userDB');
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {console.log("DB Connection Successful!");});

const userSchema=new mongoose.Schema({email:String,password:String})
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]})
const User=new mongoose.model("User",userSchema)
// const User=new mongoose.model("User",new mongoose.Schema({email:String,password:String}))

app.route("/")
    .get(function(req,res){
        res.render("home")
    })

app.route("/login")
.get(function(req,res){
    res.render("login")
})
.post(function(req,res){
    const userName=req.body.username
    const password=req.body.password
    User.findOne({email:userName})
        .then((foundUser) => {
            if (foundUser.password===password){
                res.render("secrets")
            } else {
                console.log("Incorrect Password!")
                res.render("login")
            }
        })
        .catch((err) => {
            console.log("User doesnt exist!");
            res.render("login")
        });
})

app.route("/register")
.get(function(req,res){
    res.render("register")
})
.post(function(req,res){
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save().then(() => res.render("secrets"));
})

app.route("/submit")
.get(function(req,res){
    res.render("submit")
})



app.listen(3000,function(req,res){
    console.log("SERVER STARTED!")
})
