const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

module.exports = app