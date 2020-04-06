const mongoose = require("mongoose");
const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var customerSchema = new Schema({
    ID: {
        type: Number,
        required: true,
        unique: true,
        default: parseInt(moment(new Date()).format('mmssSSS'))
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: false
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    updatedAt:
    {
        type: Date,
        default: Date.now()
    }
});

customerSchema.methods.GenerateJWTToken = function (callback) {

    bcrypt.hash(this.password, 10, (err, hashed_pw) => {
        this.password = hashed_pw;
        this.save()
            .then(result => {
                console.log(result);
                //res.status(200).send("Client created");
                callback({
                    status: "Success",
                    token: jwt.sign({
                        email: this.email,
                        firstname: this.firstname
                    }, "secret_key_7878854545aaasadadsa")
                });
            })
            .catch(err => {
                callback({
                    status: "Error",
                    details: err
                })
            });
    });

}

customerSchema.statics.verifyJWTToken = function (token) {
    var decoded;
    try {
        decoded = jwt.verify(token, "secret_key_7878854545aaasadadsa");
        return Promise.resolve(decoded);
    }
    catch (error) {
        return Promise.reject(error);
    }
}

var Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;