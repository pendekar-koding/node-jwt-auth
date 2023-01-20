const {Sequelize} = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        username: {
            type: Sequelize.STRING
        },
        deleted:{
            type: Sequelize.BOOLEAN,
            default: false
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        isLogin: {
            type: Sequelize.BOOLEAN
        }
    });

    return User;
}
