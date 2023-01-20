const db = require("../models");
const config = require("../auth/config");
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
        password : bcrypt.hashSync(req.body.password)
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
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }
                res.setHeader('Authorization', 'Bearer '+ token);
                res.status(200).send({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    roles: authorities
                });
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
