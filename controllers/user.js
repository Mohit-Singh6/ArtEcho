const User = require("../models/user.js");

module.exports.signupForm = (req,res) => {
    res.render('users/signup.ejs');
};

module.exports.signup = async (req,res, next) => {
    try {
        const {username, email, password} = (req.body);
        const user1 = new User ({email, username});
        const data = await User.register(user1, password);
        console.log(data);

        // if you want your site to log in automatically after sign up
        req.login (data, (err) => {
            if (err) return next(err); // next is declared in the signup route above, we don't write it in this one's parameters (don't know why)
            // you cannot write these 2 lines after this req.login otherwise you would redirect to /arts before the login is even completed!
            req.flash('success',"Welcome to the club!");
            res.redirect('/arts');
        })

    }
    catch (error) {
        req.flash('err',error.message);
        res.redirect('/signup');
    }
};

module.exports.loginForm = (req,res) => {
    res.render('users/login.ejs');
};

module.exports.login = async (req,res) => {
    req.flash('success',`Welcome back, ${req.user.username}!`);
    console.log(res.locals.redirectUrl);
    const redirectUrl = res.locals.redirectUrl || '/arts';
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        else {
            req.flash("success", "Logged out successfully!");
            res.redirect('/arts');
        }
    })
};