const jwt = require("jsonwebtoken");
const config = require("../auth/config.js");
const db = require("../models");
const User = db.user;
const History = db.loginHistory;


verifyToken = (req, res, next) => {
    let header = req.header('authorization');
    let token = header.replace("Bearer ", "");

    History.findOne({
        where: {
            token: token
        }
    })
        .then(history => {
            let status = history.deleted;

            if (status !== true) {
                if (!token) {
                    return res.status(400).send({
                        message: "No token provided!"
                    });
                }

                jwt.verify(token, config.secret, (err, decoded) => {
                    if (err) {
                        return res.status(401).send({
                            message: "Unauthorized!"
                        })
                    }
                    req.userId = decoded.id;
                    next();
                });
            } else {
                return  res.status(401).send({
                    message: "Token Expired"
                })
            }
        });
};

isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "admin") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: "Require Admin Role!"
            });
            return;
        });
    });
};

isModerator = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "moderator") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: "Require Moderator Role!"
            });
        });
    });
}


isModeratorOrAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "moderator") {
                    next();
                    return;
                }

                if (roles[i].name === "admin") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: "Require Moderator or Admin Role!"
            });
        });
    });
};

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isModerator: isModerator,
    isModeratorOrAdmin: isModeratorOrAdmin
};


module.exports = authJwt;
