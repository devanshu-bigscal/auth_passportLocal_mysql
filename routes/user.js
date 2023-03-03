const router = require("express")()
const { getSignUp, createUser, getProfile, getLogin, authenticated, logout } = require("../controllers/user")
const passport = require("passport")
router.get("/signup", getSignUp)
router.post("/create", createUser)
router.get("/profile", authenticated, getProfile)
router.get("/login", getLogin)
router.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login"
}))
router.get("/logout", logout)

module.exports = router