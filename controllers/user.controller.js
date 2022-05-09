const User = require('../model/user.model');
const bcrypt = require("bcryptjs");

function getUsers(req, res) {
    User.find().sort({ userId: -1 })
        .then((result) => {
            res.send(result);
        }).catch((err) => {res.status(500).send(err)});
}
function getUser(req, res) {
    User.findOne({userId: req.params.id})
        .then((result) =>{
            if (result) {
                result.password
                res.send(result)
            } else {res.status(400).send(`Exhibition id ${req.params.id} does not exist`)}
        })
        .catch((err) => res.status(500).send(err));
}
function getUsersByName(req, res) {
    User.find({name: req.params.name})
        .then((result) => {
            if (result) {
                res.send(result)
            } else {res.status(400).send(`User\'s name ${req.params.name} does not exist`)}
        }).catch((err) => {res.status(500).send(err)});
}
function getUsersByEmail(req, res) {
    User.find({email: req.params.email})
        .then((result) => {
            if (result) {
                res.send(result)
            } else {res.status(400).send(`User\'s email ${req.params.email} does not exist`)}
        }).catch((err) => {res.status(500).send(err)});
}
function getUsersByPassword(req, res) {
    User.find({password: req.params.password})
        .then((result) => {
            if (result) {
                res.send(result)
            } else {res.status(400).send(`User\'s password ${req.params.password} does not exist`)}
        }).catch((err) => {res.status(500).send(err)});
}
function getUsersByRoles(req, res) {
    User.find({roles: req.params.roles})
        .then((result) => {
            if (result) {
                res.send(result)
            } else {res.status(400).send(`User\'s role ${req.params.roles} does not exist`)}
        }).catch((err) => {res.status(500).send(err)});
}
//PUT : CREATION
function putUser(req, res) {
    // if (!req.body.name && !req.body.artist && !req.body.picture && !req.body.date) {
    //     return res.status(400).send('Exhibition\'s name, artist, picture and date are mandatory');
    // }
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        roles: req.body.roles,
    });
    user.save()
        .then((result) => {
            res.send(result);
        }).catch((err) => {
        res.status(500).send(err);
    });
}

//POST : UPDATE
async function postUser(req, res) {
    // if (!req.body.name && !req.body.artist && !req.body.picture && !req.body.date) {
    //     return res.status(400).send('Missing Exhibitions');
    // }
    User.findOneAndUpdate({userId: req.params.id}, {
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        roles: req.body.roles,
    }).then((result) => {
        res.send(result);
    }).catch((err) => {
        res.status(500).send(err);
    });
}
function deleteUser(req, res) {
    User.findOneAndDelete({userId: req.params.id})
        .then((result) => {
            res.send(result);
        }).catch((err) => {res.status(500).send(err)});
}

module.exports = {
    getUsers, getUser, getUsersByName, getUsersByEmail,
    getUsersByPassword, getUsersByRoles, postUser, putUser, deleteUser
}