const express = require("express");
const cors = require("cors");

let app = express();
app.use(cors());


// RESTful API
// Parameterised route
app.get("/hello/:name", (req, res) => {
    let name = req.params.name;
    console.log("Name: ", name)
    res.send("Hi, " + name + "!")
})

// Query string
app.get("/echo", (req, res) => {
    const queryParams = req.query;
    console.log(queryParams);
    res.send("Do you want to eat: " + queryParams.cuisine + "?");
})


app.get("/differences/:n1/:n2", (req, res) => {
    let n1 = parseInt(req.params.n1);
    let n2 = parseInt(req.params.n2);
    // console.log("n1 type: ", typeof(n1))
    // console.log("n2 type: ", typeof(n2))
    res.send("Your difference is: " + (n1 - n2));
})

"htttp://localhost:3200/scream?message=hi&recipient=john"
app.get("/scream", (req, res) => {
    const queries = req.query;
    // {
    //     "message": "hi",
    //     "recipient": "john"
    // }
    console.log(queries)
    const message = queries.message.toUpperCase();
    const recipient = queries.recipient.toUpperCase();
    res.send(message + " " + recipient)
})

// Get all shoes
app.get("/shoes", (req, res) => {
    // write code to call my mongoDB to retrieve ALL SHOES
})

app.listen(3200, ()=> {
    console.log("Server started with nodemon")
})
