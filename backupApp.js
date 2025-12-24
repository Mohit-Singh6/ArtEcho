const express = require('express');
const app = express();
const listing = require("./models/listing.js");
const review = require("./models/review.js");
const path = require('path')
const mongoose = require('mongoose');
const wrapAsync = require('./utilities/wrapAsync.js');
const myError = require('./utilities/myError.js');

// const artSchema = require("./schema.js"); // this is if you write (in schema.js) module.exports = artSchema
// and this is if you write (in schema.js) module.exports.artSchema = artSchema
const {artSchema, reviewSchema} = require("./schema.js");

const ejsMate = require('ejs-mate');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine('ejs', ejsMate);


const methodOverride = require('method-override');


const validateArt = (req,res,next) => {
    const {error} = artSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        console.log(error.details);
        throw new myError (400, errMsg);
    }
    else next();
}

const validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        console.log(error.details);
        throw new myError (400, errMsg);
    }
    else next();
}


// Allow ?_method=PUT in POST requests
app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/ArtEcho');
}

main()
    .then(() => {
        console.log("Connection -><- Made!");
    })
    .catch(err => console.log(err));


const port = 3000;

app.listen(port, () => {
    console.log("SERVER STARTED <+>");
});

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


// SHOW ARTS

// error handling using try and catch

app.get("/arts", async (req, res, next) => {
    try {
        const arts = await listing.find();
        res.render('listings/index.ejs', { arts });
    } catch (err) {
        next(err);
    }
});


// Error handling using wrapAsync


app.get("/arts/create", wrapAsync (async (req, res) => {
    res.render("listings/newArt.ejs");
})
);


app.get("/arts/:id", wrapAsync (async (req, res) => {
    const artId = req.params.id;
    const art = await listing.findById(artId).populate("reviews");
    console.log(art);
    
    res.render("listings/arts.ejs", { art });
}));


// UPLOAD NEW ART


        // Manually implementing art validation (if all or some field is empty)

// app.post("/arts", wrapAsync (async (req, res, next) => {
//     const data = req.body.art;
    
//     // This if block is just for the case when empty data is sent from hoppscotch although you can comment this out as the error handling for incomplete or empty data is now being done from joi.
    
//     // if (!data) {
//         //     throw new myError(400,"Send some valid data!");
//         //     // or 
//         //     // next (new myError(400,"Send some valid data!"));
//         // }
        

        // Art Validation
//     const val = artSchema.validate(req.body);
//     console.log(val);
//     if (val.error) {
//         throw new myError (400, val.error);
//     }
        
//     // console.log(data);
//     data.yearCreated = new Date().getFullYear();
//     const newData = new listing(data);
//     await newData.save();
//     res.redirect('/arts');
// }));


    
        // Art Validation using middleware

app.post("/arts", validateArt, wrapAsync (async (req, res, next) => {
    const data = req.body.art;

    console.log(data);
    data.yearCreated = new Date().getFullYear();
    const newData = new listing(data);
    await newData.save();
    res.redirect('/arts');
}));


    // posting reviews

app.post("/arts/:id/reviews", validateReview, wrapAsync (async (req, res, next) => {
    const artId = req.params.id;
    const data = new review(req.body.review);
    console.log("REVIEW: ", data);

    const art = await listing.findById(artId);

    art.reviews.push(data._id);
    await data.save();
    await art.save();

    res.redirect('/arts/' + artId);
}));


// UPDATE

app.get("/arts/update/:id", wrapAsync (async (req, res) => {
    const data = await listing.findById(req.params.id);
    console.log(data);
    res.render('listings/update.ejs', { data });
}));



app.put("/arts/:id", wrapAsync (async (req, res) => {
    const id = req.params.id;
    const newData = req.body.art;
    console.log(newData);


    // await listing.findByIdAndUpdate(data._id, newData, {runValidators: true, new: true});
    // res.redirect("/arts");

    // or by using a deconstructor (both are good methods but prefer using a deconstructor)

    await listing.findByIdAndUpdate(id, { ...newData }, { runValidators: true, new: true });
    res.redirect('/arts/' + id);
}));


// DELETE

app.delete("/arts/:id", wrapAsync (async (req, res) => {
    const id = req.params.id;
    const data = await listing.findById(id);
    console.log("DELETED: ", data);
    await listing.findByIdAndDelete(id);
    res.redirect('/arts');
}));


// delete reviews

app.delete("/arts/:id/reviews/:reviewId", wrapAsync (async (req, res) => {
    const id = req.params.id;
    const {reviewId} = req.params;

    
    await review.findByIdAndDelete(reviewId);
    
    // Method 1 to delete from art
    await listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    
    
    // Method 2:

    // const data = await listing.findById(id);
    // let idx = data.reviews.indexOf(reviewId);
    // if (idx != -1) {
    //     data.reviews.splice(idx, 1);
    // }
    // data.save();

    res.redirect(`/arts/${id}`);
}));


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