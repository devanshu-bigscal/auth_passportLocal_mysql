const { Sequelize } = require("sequelize")

const sequelize = new Sequelize("passport_crud", "root", "root@1234", {
    dialect: "mysql",
    host: "localhost"
})


sequelize.authenticate().then(db => console.log("Db connected successfully")).catch(err => console.log("db connection failed", err))


module.exports = sequelize