const express = require("express");
const app = express();
const users = require("./routes/user");
const posts = require("./routes/post");
// const cookieParser = require("cookie-parser");

// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in","India",{signed: true});
//     res.send("signed cookie sent");
// });

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// });

// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","namaste");
//     res.cookie("madeIn","India");

//     res.send("sent you some cookies!");
// });

// app.get("/greet",(req,res)=>{
//     let {name = "anonymous"} = req.cookies;
//     res.send(`Hi ${name}`);
// });

// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("Hi , I am root!");
// });

// app.use("/users",users);
// app.use("/posts",posts);
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

//Express Sessions
const session = require("express-session");
const flash = require("connect-flash");


const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/register",(req,res)=>{
    let {name ="anonymous"} = req.query;
    req.session.name = name;
    if(name ==="anonymous"){
        req.flash("error","User not registered");
    } else{
        req.flash("success","User registered successful");
    }
    res.redirect("/hello");
    // console.log(req.session.name);
    // res.send(name);
});

app.get("/test",(req,res)=>{
    res.send("Test successful!");
});

app.get("/hello",(req,res)=>{
    // res.send(`HELLO ${req.session.name}`);
    // res.locals.success = req.flash("success");
    // res.locals.error = req.flash("error");
    res.render("page.ejs",{name :req.session.name });
});


// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     } else {
//         req.session.count= 1;
//     }
//     res.send(`You sent a request ${req.session.count} times`);
// });

app.listen(3000,()=>{
    console.log("server is listing to 3000");
});