const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var db = require("./db/mongoose");
var Customer = require("./models/customer");
var app = express();

const PORT = 3000;

var customer1 = new Customer({
    firstname: "Jhon",
    lastname: "Sierras",
    email: "jhon.app@example.com",
    phone: "4541212",
    address: "Av. San Martin 589"
});

app.use(bodyParser.json());
app.post("/customer/create", (req, res) => {
    var entity = new Customer(req.body);
    entity.GenerateJWTToken((result) => {
        if (result.status == "Success") {
            res.json(result);
        }
        else {
            res.status(500).send(rresult.details);
        }
    })

});

app.get("/customer", (req, res) => {

    Customer.verifyJWTToken(req.header("X-Auth"))
        .then(result => {
            return Customer.find({});
        })
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err));
});

app.get("/customer/:id", (req, res) => {

    Customer.verifyJWTToken(req.header("X-Auth"))
        .then(result => {
            return Customer.findOne({ "ID": req.params.id });
        })
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err));

});

app.patch("/customer/:id", (req, res) => {

    req.body.update_timestamp = Date.now();

    Customer.verifyJWTToken(req.header("X-Auth"))
        .then(result => {
            return Customer.findOneAndUpdate({ "ID": req.params.id }, req.body);
        })
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err));

});

app.listen(PORT, () => {
    console.log("Express listening on port: ", PORT);
});

