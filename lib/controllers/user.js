'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('../models/user'),
    bcrypt = require('bcrypt');

exports.login = function (req, res, next) {
    var email = req.body.email,
        password = req.body.password;

    // if email or password is blank, stop the request and return 403
    if (!(email || password)) {
        res.send({
            message: "Invalid parameters",
            status: 403
        }, 403);
    }

    // search for email in the database
    User.findOne({'email': email}, function (err, foundUser) {
        if (err) return res.send(err, 500);

        // if not found, return 403
        if (!foundUser) {
            return res.send({
                message: "User not found",
                status: 403
            }, 403);
        }
        bcrypt.compare(password, foundUser.password, function (err, match) {
            if (err) return res.send(err, 500);
            if (!match) {
                return res.send({
                    message: "Invalid credentials.",
                    status: 403
                }, 403);
            }
            return res.send(foundUser, 200);
        });
    });
};

    /*
        User Registration

        params:
            + emai
            l
            + password
    */
exports.register = function(req, res, next) {
    var email = req.body.email,
        password = req.body.password,
        age = req.body.age,
        name = req.body.name;
    // if email or password is blank, stop the request and return 403
    if (!(email || password)) {
        res.send({
            message: "Invalid parameters",
            status: 403
        }, 403);
    }

    // search for email in the database
    User.findOne({'email': email}, function (err, user) {
        if (err) return res.send(err, 500);

        // if found existing user
        if (user) {
            return res.send({
                message: "User exists. Try different email or use forgot password feature",
                status: 403
            }, 403);
        }

        // otherwise, continue the process
        var newUser = new User({
            email: email,
            password: password,
            age: age,
            name: name
        });
        newUser.save(function(err){
            if (err)
                return res.send({
                    message: "Error happens. Please try again.",
                    status: 403
                }, 403);
            return res.send(newUser, 200);
        });
    });
};