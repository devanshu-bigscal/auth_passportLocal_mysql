const userModel = require("../models/user");
const bcrypt = require("bcrypt");

exports.getSignUp = (req, res) => {
    res.render("signup");
};
exports.getProfile = async (req, res) => {
    const user = await userModel.findOne({
        where: { id: req.session.passport.user },
    });
    const { name, email } = user;
    res.render("profile", { user: { name, email } });
};
exports.getLogin = (req, res) => {
    res.render("login");
};

exports.createUser = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);

        const password = await bcrypt.hash(req.body.password, salt);

        const { name, email } = req.body;

        const newUser = await userModel.create({ name, password, email });

        res.redirect("/login");
    } catch (error) {
        console.log(error);
    }
};

exports.authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
};

exports.logout = (req, res) => {
    req.logOut()
    res.redirect("/login")
}
