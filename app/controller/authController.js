const db = require("../models");
const config = require("../auth/config");
const common = require("../common/commonResponse");
const User = db.user;
const Role = db.role;
const History = db.loginHistory;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
exports.signup = (req, res) => {
    User.create({
        username : req.body.username,
        email : req.body.email,
        password : bcrypt.hashSync(req.body.password),
        deleted: false
    })
        .then(user => {
            if (req.body.roles) {
                Role.findAll({
                    where: {
                        name: {
                            [Op.or]: req.body.roles
                        }
                    }
                }).then(roles => {
                    user.setRoles(roles).then(() => {
                        res.send({ message: "User was registered successfully!" });
                    });
                });
            } else {
                // user role = 1
                user.setRoles([1]).then(() => {
                    res.send({ message: "User was registered successfully!" });
                });
            }
        })
        .catch(err => {
            res.status(500).send({message : err.message});
        });
};

exports.signout = (req, res) => {
    let header = req.header('authorization');
    let token = header.replace("Bearer ", "");

    History.findOne({
        where: {
            token: token
        }
    }).then(history => {
        History.update({
            deleted: true
        }, {
            where: {
                id: history.id
            }
        })
        User.update({
            isLogin: false
        }, {
            where: {
                id: history.userId
            }
        });

        return res.json(common.signoutSuccess());
    });
}


exports.signin = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
        .then(user => {
            if (!user) {
                return res.status(404).send({message: "User Not Found."})
            }
            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    message: "Invalid Password"
                });
            }

            var token = jwt.sign({id : user.id}, config.secret, {
                expiresIn: 86400 //24hours
            });


            var authorities = [];
            var data;
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }
                data = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    roles: authorities
                }
                res.setHeader('Authorization', token);
                res.json(common.success(data));
            });

            User.update({
                isLogin: true
            }, {
                where: {
                    id: user.id
                }
            });

            History.update({
                deleted: true
            }, {
                where: {
                    userId: user.id
                }
            });

            History.create({
                userId: user.id,
                deleted: false,
                token: token
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
}
