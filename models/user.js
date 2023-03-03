const { DataTypes } = require('sequelize')
const sequelize = require('../connection/db_connection')

const User = sequelize.define("Users", {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
})

User.sync({ force: true })

module.exports = User