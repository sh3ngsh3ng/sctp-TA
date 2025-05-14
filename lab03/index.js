const express = require('express');
require('dotenv').config();
const MongoClient = require("mongodb").MongoClient;
const mongoUri = process.env.MONGO_URI;
const {ObjectId} = require('mongodb')

let app = express();

// Utility function to connect to mongo
async function connect(uri, dbname) {
    const client = await MongoClient.connect(uri);
    console.log("Connected to MongoDB");
    return client.db(dbname);
}

// Application setup
async function main() {
    // Connect to mongodb
    let db = await connect(mongoUri, "recipe_book");

    // Get all recipe
    app.get("/recipe", async (req, res) => {
        try {
            const allRecipe = await db.collection("recipes").find().project({
                name: 1,
                cuisine: 1,
                prepTime: 1
            }).toArray();
            // throw Error;
            console.log(allRecipe);
            res.json(allRecipe);
        } catch(e) {
            console.log(e)
            res.status(400).json({
                "message": "error"
            })
        }
    })

    // Get recipe by id
    app.get("/recipe/:id", async (req, res) => {
        try {
            let id = req.params.id;
            console.log(id);
            const allRecipe = await db.collection("recipes").find({
                _id : new ObjectId(id)
            }).project({
                name: 1,
                cuisine: 1,
                prepTime: 1
            }).toArray();
            // throw Error;
            console.log(allRecipe);
            res.json(allRecipe);
        } catch(e) {
            console.log(e)
            res.status(400).json({
                "message": "error"
            })
        }
    })

    // Get recipe by name
    app.get("/recipe/name/:name", async (req, res) => {
        try {
            let name = req.params.name;
            console.log(typeof(name));
            const allRecipe = await db.collection("recipes").find({
                name: name
            }).project({
                name: 1,
                cuisine: 1,
                prepTime: 1
            }).toArray();
            // throw Error;
            console.log(allRecipe);
            res.json(allRecipe);
        } catch(e) {
            console.log(e)
            res.status(400).json({
                "message": "error"
            })
        }
    })
}

main();

app.listen(3200, () => {
    console.log("database started")
})

