const express = require("express")
const app = express()
const userRoutes = require("./routes/user")
const sequelize = require("./connection/db_connection")
const passport = require("passport")
const session = require("express-session")
const LocalStrategy = require("passport-local").Strategy
require("dotenv").config()
const userModel = require("./models/user")
const bcrypt = require("bcrypt")
app.use(express.urlencoded({ extended: false }))

app.set("view engine", "ejs")


app.use(express.static(__dirname + "/public"))


app.use(session({
    saveUninitialized: true,
    secret: process.env.SECRET,
    resave: false
}))
// This is the basic express session({..}) initialization.


app.use(passport.initialize())
// init passport on every route call.


app.use(passport.session())
// allow passport to use "express-session".

app.use(userRoutes)

passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
}, async function (email, password, done) {
    const user = await userModel.findOne({ where: { email: email } })
    if (!user) {
        return done(null, false)
    }

    const result = await bcrypt.compare(password, user.password)
    if (!result) return done(null, false)

    return done(null, user)
}))



passport.serializeUser(function (user, done) {
    done(null, user.id)
})
// WHAT DOES SERIALIZE USER MEAN ?

// 1. "express-session" creates a "req.session" object, when it is invoked via app.use(session({..}))
// 2. "passport" then adds an additional object "req.session.passport" to this "req.session".
// 3. All the serializeUser() function does is,
//     receives the "authenticated user" object from the "Strategy" framework, and attach the authenticated user to "req.session.passport.user.{..}"




passport.deserializeUser(function (id, done) {
    userModel.findOne({ where: { id: id } }).then(user => {
        if (user) {
            done(null, user.get())
        } else {
            done(user.errors, null)
        }
    })
})
// WHAT DOES DE SERIALIZE USER MEAN ?
//  1. Passport JS conveniently populates the "userObj" value in the deserializeUser() with the object attached at the end of "req.session.passport.user.{..}"
// 2. When the done(null, user) function is called in the deserializeUser(), Passport JS takes this last object attached to "req.session.passport.user.{..}", and attaches it to "req.user" i.e "req.user.{..}"



const port = process.env.PORT || 8000



app.listen(port, () => console.log(`Server running at port : ${port}`))
