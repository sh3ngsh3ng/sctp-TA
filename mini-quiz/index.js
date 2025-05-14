const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoUri = process.env.MONGO_URI;
const MongoClient = require("mongodb").MongoClient;
const dbname = "recipe_book"; 
const { ObjectId } = require('mongodb');

let app = express();
app.use(cors());

async function connect(uri, dbname) {
    let client = await MongoClient.connect(uri)
    let db = client.db(dbname);
    return db;
}

async function main() {
    let db = await connect(mongoUri, dbname);

    // Get all recipe
    app.get("/recipe", async function (req, res) {
        try {
            const recipes = await db.collection("recipes").find().project({
                _id: 0,
                name: 1,
                cuisine: 1,
            }).toArray();
            
            res.json({ recipes });
        } catch (error) {
            console.error("Error fetching recipes:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    // Get cuisine by ID
    app.get("/cuisine/:id", async function (req, res) {
        
        try {
            const cuisineId = req.params.id
            console.log(cuisineId)
            const cuisine = await db.collection("cuisines").find({
                _id: new ObjectId(cuisineId)
            }).project(
                {
                    _id: 0
                }
            ).toArray();
            
            res.json({ cuisine });
        } catch (error) {
            console.error("Error fetching cuisine:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });
}

main();

app.listen(3200, ()=>{
    console.log("Server started")
})

