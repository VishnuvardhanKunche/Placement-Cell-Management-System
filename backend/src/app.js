const express = require("express");

const app = express();

app.get("/",(req,res)=>{
    res.send("Welcome to the Smart placement cell management system");
});

module.exports = app;