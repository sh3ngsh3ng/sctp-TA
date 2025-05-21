// SETUP BEGINS
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const dbname = "recipe_book";
const {ObjectId} = require("mongodb");

const mongoUri = process.env.MONGO_URI;

let app = express();

// !! Enable processing JSON data
app.use(express.json());

// !! Enable CORS
app.use(cors());

async function connect(uri, dbname) {
    let client = await MongoClient.connect(uri, {
        useUnifiedTopology: true
    })
    _db = client.db(dbname);
    return _db;
}

// SETUP END
async function main() {

    let db = await connect(mongoUri, dbname);

    // Routes
    app.get('/', function (req, res) {
        res.json({
            "message": "Hello World!"
        });
    })

    // POST: Add new tag
    app.post("/tags", async (req, res) => {
        try {
            const { tagName } = req.body

            // Validation 1: User did not send tag name
            if (!tagName) {
                return res.status(400).json({ error: 'Please send a tag name' });
            }

            // Validation 2: Tag already exist in our database
            const tagDoc = await db.collection("tags").find({name: tagName}).toArray();
            if (tagDoc.length > 0) {
                return res.status(400).json({ error: 'Tag already present' });
            }

            // Dont need to provide _id because MongoDB will add for us in new document
            const newTag = {
                name: tagName
            }

            const result = await db.collection('tags').insertOne(newTag);

            res.status(201).json({
                message: 'Tag created successfully',
                tagId: result.insertedId
            });
        } catch (error) {
            console.error('Error creating tag:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // DELETE: Delete a tag by ID
    app.delete("/tags/:id", async(req, res) => {
        try {
            // Read the data sent from user
            const { id } = req.params
            const result = await db.collection('tags').deleteOne({ _id: new ObjectId(id) });
            if (result.deletedCount == 0) {
                return res.status(404).json({ error: 'Tag not found' });
            }
            res.json({ message: 'Tag deleted successfully' });
        } catch (error) {
            console.error('Error deleting tag:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // PUT: Update tag name by ID
    // To-do

}

main();

// START SERVER
app.listen(3400, () => {
    console.log("Server has started");
});