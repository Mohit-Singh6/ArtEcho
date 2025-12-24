
const express = require('express');
const wrapAsync = require('../utilities/wrapAsync.js');
const artController = require('../controllers/art.js');
const { validateArt } = require('../middleware.js');
const { isLoggedIn, isOwner } = require('../middleware.js');

// multer for file uploads
const multer  = require('multer')
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage })



const router = express.Router(); // here mergeParams is not required because every id that we need here is in the route only (in this file), we donnot need any parameter from app.js 



    // Using router.route

router
    .route ('/')
    .get (wrapAsync (artController.index))
    .post(isLoggedIn, upload.single('art[image]'), validateArt, wrapAsync(artController.uploadArt));
    // .post(upload.single('art[image]'), (req,res) => {
    //     res.send(req.file);
    // })

router.get("/paintings", wrapAsync(artController.showPaintings));
router.get("/photograph", wrapAsync(artController.showPhotograph));
router.get("/sculptures", wrapAsync(artController.showSculptures));
router.get("/digitalart", wrapAsync(artController.showDigitalArt));
router.get("/multimedia", wrapAsync(artController.showMultimedia));
router.get("/otherarts", wrapAsync(artController.showOtherArts));

router.get("/create", isLoggedIn, wrapAsync(artController.createForm));
router.get("/update/:id", isOwner, isLoggedIn, wrapAsync(artController.editForm));


router.get("/search", wrapAsync(artController.searchArt));

router
    .route ('/:id')
    .get(wrapAsync(artController.showArt))
    .post(isLoggedIn, validateArt, wrapAsync(artController.uploadArt))
    .put(isOwner, isLoggedIn, upload.single('art[image]'), validateArt, wrapAsync(artController.updateArt))
    .delete(isOwner, isLoggedIn, wrapAsync(artController.deleteArt));





    // Without using router.route

// // SHOW ARTS

// // error handling using try and catch

// // router.get("/", async (req, res, next) => {
// //     try {
// //         const arts = await listing.find();
// //         res.render('listings/index.ejs', { arts });
// //     } catch (err) {
// //         next(err);
// //     }
// // });

// router.get("/", wrapAsync (artController.index));


// // Error handling using wrapAsync


// router.get("/create", isLoggedIn, wrapAsync(artController.createForm));

// // see a specific art
// router.get("/:id", wrapAsync(artController.showArt));


// // UPLOAD NEW ART


// // Manually implementing art validation (if all or some field is empty)

// // router.post("/", wrapAsync (async (req, res, next) => {
// //     const data = req.body.art;

// //     // This if block is just for the case when empty data is sent from hoppscotch although you can comment this out as the error handling for incomplete or empty data is now being done from joi.

// //     // if (!data) {
// //         //     throw new myError(400,"Send some valid data!");
// //         //     // or 
// //         //     // next (new myError(400,"Send some valid data!"));
// //         // }


// // Art Validation
// //     const val = artSchema.validate(req.body);
// //     console.log(val);
// //     if (val.error) {
// //         throw new myError (400, val.error);
// //     }

// //     // console.log(data);
// //     data.yearCreated = new Date().getFullYear();
// //     const newData = new listing(data);
// //     await newData.save();
// //     res.redirect('/arts');
// // }));



// // Art Validation using middleware

// router.post("/", isLoggedIn, validateArt, wrapAsync(artController.uploadArt));


// // UPDATE art
// router.get("/update/:id", isOwner, isLoggedIn, wrapAsync(artController.editForm));
// router.put("/:id", isOwner, isLoggedIn, wrapAsync(artController.updateArt));


// // DELETE art
// router.delete("/:id", isOwner, isLoggedIn, wrapAsync(artController.deleteArt));


module.exports = router;