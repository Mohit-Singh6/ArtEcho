if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require('express');
let MongoStore = require('connect-mongo');
// handle ESM/CJS interop where the package may export a default
if (MongoStore && !MongoStore.create && MongoStore.default) MongoStore = MongoStore.default;
const app = express();
const path = require('path')
const mongoose = require('mongoose');
const myError = require('./utilities/myError.js');

// requiring passport stuff
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

// requiring arts and review routes
const artRouter = require('./routes/art.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

// requiring and using express sessions
const session = require('express-session');

// let mongoUrl = "mongodb://127.0.0.1:27017/ArtEcho";
let atlasDBurl = process.env.ATLASDB_URL;


const mongoStore = MongoStore.create({
    mongoUrl: atlasDBurl,
    crypto: {
        secret: process.env.SECRET
    },
    // reduce writes to session store: only update once per 24h when session is unchanged
    touchAfter: 24 * 60 * 60 // time period in seconds
});

// note that mongoStore should be created before session settings because we are using it inside session settings

mongoStore.on("err", (err) => {
    console.log("MONGO SESSION STORE ERROR", err);
});

const settings = {
    store: mongoStore, // to store session info in the database instead of memory
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        // Method 1 to delete a cookie after some time.
        expires: Date.now() + 3 * 24 * 60 * 60 * 1000, // in milliseconds (3 days 24 hrs 60 min 60 sec 1000 ms)
        // Method 2 to expire a cookie after some time.
        // maxAge: 3 * 24 * 60 * 60 * 1000, // only use one out of these two as only the one which was written later will work.
        httpOnly: true // to avoid cross scripting attacks
    }
};

app.use(session(settings));

// using passport after express-session use
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // every request should be authenticated through the LocalStrategy

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser()); // user ke related info ko store karwaane ke liye session mein
passport.deserializeUser(User.deserializeUser()); // user ke related info remove karne ke liye

// requiring and using flash
const flash = require('connect-flash');
app.use(flash());


// middleware for saving flash message in res.locals

app.use((req,res,next) => {
    res.locals.successMsg = req.flash('success');
    res.locals.errorMsg = req.flash('err');
    res.locals.currUser = req.user;
    next() ; // very important here
});



// const artSchema = require("./schema.js"); // this is if you write (in schema.js) module.exports = artSchema
// and this is if you write (in schema.js) module.exports.artSchema = artSchema
// const {artSchema, reviewSchema} = require("./schema.js");

const ejsMate = require('ejs-mate');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine('ejs', ejsMate);


const methodOverride = require('method-override');



// Allow ?_method=PUT in POST requests
app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

const port = 3000;

app.listen(port, () => {
    console.log("SERVER STARTED <+>");
});

async function main() {
    // await mongoose.connect(mongoUrl); // use this for local mongodb, here await is necessary
    mongoose.connect(atlasDBurl); // no need of await here
}

main()
    .then(() => {
        console.log("Connection -><- Made!");
    })
    .catch(err => console.log(err));


// Games overall idea
// Name
// Price - number
// image - url
// Release Year - number
// Category - string
// Minimum requirements - string
// Platform - String (pc,xbox,ps,mobile)


// EXTRA
app.get("/", (req, res) => {
    res.send("Nothing to see here. Go to /arts");
});


// Handling routes
app.use('/arts', artRouter);
app.use('/arts/:id/reviews', reviewRouter);
app.use('/', userRouter);


app.all (/.*/, (req,res,next) => {
    next(new myError(404, "Page Not Found! Try to go to the home page."));
});


// Error Handling Middleware (for all the errors that might occur above this code)
app.use((err, req, res, next) => {
    console.log(err.name);
    const {statusCode = 400, message = "Error"} = err;
    res.render("./listings/error.ejs",{err, statusCode});
    // res.status(statusCode).send(message);
});