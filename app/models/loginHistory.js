const {Sequelize} = require("sequelize");


module.exports = (sequelize, Sequelize) => {
    const LoginHistory = sequelize.define("login_history", {
        userId: {
            type: Sequelize.INTEGER,
            references: {
                model: "users",
                key: "id"
            }
        },
        deleted: {
            type: Sequelize.BOOLEAN
        },
        token: {
            type: Sequelize.STRING
        }
    });
    return LoginHistory;
}
