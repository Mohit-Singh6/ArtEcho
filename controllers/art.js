const listing = require('../models/listing.js');

module.exports.index = async (req, res, next) => {
    const arts = await listing.find();
    res.render('listings/index.ejs', { arts });
};

module.exports.showPhotograph = async (req, res, next) => {
    const arts = await listing.find({type: "Photograph"});
    res.render('listings/index.ejs', { arts });
};

module.exports.showPaintings = async (req, res, next) => {
    // fixed: model enum is 'Paintings' (plural)
    const arts = await listing.find({type: "Paintings"});
    res.render('listings/index.ejs', { arts });
};

module.exports.showSculptures = async (req, res, next) => {
    const arts = await listing.find({type: 'Sculpture'});
    res.render('listings/index.ejs', { arts });
};

module.exports.showDigitalArt = async (req, res, next) => {
    const arts = await listing.find({type: 'Digital Art'});
    res.render('listings/index.ejs', { arts });
};

module.exports.showMultimedia = async (req, res, next) => {
    // fixed: model enum for mixed media is 'Mixed Media'
    const arts = await listing.find({type: "Mixed Media"});
    res.render('listings/index.ejs', { arts });
};

module.exports.showOtherArts = async (req, res, next) => {
    const arts = await listing.find({type: "Other"});
    res.render('listings/index.ejs', { arts });
};

module.exports.searchArt = async (req, res, next) => {
    const q = req.query.q;
    const arts = await listing.find({title: { $regex: q, $options: 'i' }});
    if (arts.length > 0) {
        res.render('listings/index.ejs', { arts });
    }
    else {
        res.render('listings/noListings.ejs', { q });
    }
};

module.exports.showArt = async (req, res) => {
    const artId = req.params.id;
    const art = await listing.findById(artId).populate("reviews").populate("owner").populate({
        path: 'reviews',
        populate: {
            path: 'owner'
        }
    });
    console.log(art);

    // flash message in case the art doesn't exists
    if (!art) {
        req.flash('err', "The art you are looking for - does not exist or was deleted!");
        res.redirect('/arts');
    }
    else res.render("listings/arts.ejs", { art }); // writing else here is very important as if you don't then even if the art doesnot exists then also this might run
};

module.exports.createForm = async (req, res) => {
    console.log(req.user);
    res.render("listings/newArt.ejs");
};

module.exports.uploadArt = async (req, res, next) => {
    const data = req.body.art;

    const url = req.file.path;
    const filename = req.file.filename;
    data.image = {url, filename};

    console.log(data);
    data.yearCreated = new Date().getFullYear();
    data.owner = req.user._id; // assigning the current logged in user as it's owner
    const newData = new listing(data);
    await newData.save();

    // flash message
    req.flash('success', "New art uploaded successfully.");

    // the general middleware for saving this in locals will be in app.js because if i do it here then after i redirect then the variables/data will be lost, alternative would be to initialize it just before you render the page (should be no redirecting afterwards - ex: in line 30 (where the comment SHOW ARTS is there))

    res.redirect('/arts');
};

module.exports.editForm = async (req, res) => {
    const data = await listing.findById(req.params.id);
    console.log(data);

    // flash message in case the art doesn't exists
    if (!data) {
        req.flash('err', "The art you are looking for - does not exist or was deleted!");
        res.redirect('/arts');
    }
    else {
        let newUrl = data.image.url;
        newUrl = newUrl.replace('upload/', 'upload/h_300,w_250/');
        res.render('listings/update.ejs', { data, newUrl });
    }
};

module.exports.updateArt = async (req, res) => {
    const id = req.params.id;

    // let url = req.file.path;
    // let filename = req.file.filename;

    let newData = await listing.findByIdAndUpdate(id, { ...req.body.art }, { runValidators: true, new: true });

    
    // if the new image was uploaded then make the changes.
    if (typeof req.file !== 'undefined') {
        console.log("REQ.FILE: ",req.file);
        const url = req.file.path;
        const filename = req.file.filename;
        newData.image = {url, filename};
        await newData.save();
    }
    
    console.log("\nNEWDATA: ", newData);

    // await listing.findByIdAndUpdate(data._id, newData, {runValidators: true, new: true});
    // res.redirect("/arts");

    // or by using a deconstructor (both are good methods but prefer using a deconstructor)

    // flash message
    req.flash('success', "Art updated successfully!");

    res.redirect('/arts/' + id);
};


module.exports.deleteArt = async (req, res) => {
    const id = req.params.id;
    const data = await listing.findById(id);
    console.log("DELETED: ", data);
    await listing.findByIdAndDelete(id);

    // flash message
    req.flash('success', "Art deleted successfully!");

    res.redirect('/arts');
};


