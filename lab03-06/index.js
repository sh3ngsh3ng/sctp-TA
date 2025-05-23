// SETUP BEGINS
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const dbname = "recipe_book";
const { ObjectId } = require('mongodb');

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

    // GET: hello world
    app.get('/', function (req, res) {
        console.log("hello world is called")
        res.status().json({
            "message": "Hello World!"
        });
    })

    // GET: Get all recipe
    app.get("/recipes", async (req, res) => {
        try {
            const recipes = await db.collection("recipes").find().project({
                name: 1,
                cuisine: 1,
                tags: 1,
                prepTime: 1,
            }).toArray();

            res.json({ recipes });
        } catch (error) {
            console.error("Error fetching recipes:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    // GET: Get recipe by id
    app.get("/recipes/:id", async (req, res) => {
        try {
            const id = req.params.id;

            // First, fetch the recipe
            const recipe = await db.collection("recipes").findOne(
                { _id: new ObjectId(id) },
                { projection: { _id: 0 } }
            );

            if (!recipe) {
                return res.status(404).json({ error: "Recipe not found" });
            }

            res.json(recipe);
        } catch (error) {
            console.error("Error fetching recipe:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    // GET: Search for recipe
    app.get("/search", async (req, res) => {
        try {
            // 1. Get data from query string
            const { tags, cuisine, ingredients, name } = req.query

            // 2. Write logic to build query object
            let query = {}

            if (tags) {
                query["tags.name"] = { $in: tags.split(",") }
            }

            if (cuisine) {
                query["cuisine.name"] = { $regex: cuisine, $options: "i" }
            }

            if (ingredients) {
                query["ingredients.name"] = { $all: ingredients.split(",").map(i => new RegExp(i, "i")) }
            }

            if (name) {
                query.name = { $regex: name, $options: "i" }
            }

            // 3. Call DB with our query object for filter
            const recipes = await db.collection("recipes").find(query).toArray();
            // 4. Return the results
            res.json({ recipes })
        } catch (error) {
            console.error("Error searching for recipe: ", error);
            res.status(500).json({ error: "Internal server error" })
        }
    })

    // POST: Add a new recipe
    app.post("/add", async (req, res) => {
        try {
            const { name, cuisine, prepTime, cookTime, servings, ingredients, instructions, tags } = req.body;

            if (!name || !cuisine || !ingredients || !instructions || !tags) {
                return res.status(400).json({ error: "Missing required fields" })
            }

            // Fetching cuisine document
            const cuisineDoc = await db.collection("cuisines").findOne({ name: cuisine })
            if (!cuisineDoc) {
                return res.status(400).json({ error: "Invalid cuisine" })
            }

            // Fetch tag documents
            const tagDocs = await db.collection("tags").find({
                name: { $in: tags }
            }).toArray();
            if (tagDocs.length !== tags.length) {
                return res.status(400).json({ error: "One or more invalid tags" })
            }

            const newRecipe = {
                name,
                cuisine: {
                    _id: cuisineDoc._id,
                    name: cuisineDoc.name
                },
                prepTime,
                cookTime,
                servings,
                ingredients,
                instructions,
                tags: tagDocs.map(tag => ({
                    _id: tag._id,
                    name: tag.name
                }))
            }

            const result = await db.collection("recipes").insertOne(newRecipe)
            // {
            //     acknowledged: true,
            //     insertedId: new ObjectId("68283a9e4b6e247190f37d4a")
            // }

            res.status(201).json({
                message: "Recipe created successfully",
                recipeId: result.insertedId
            })

        } catch (error) {
            console.error("Error creating recipe: ", error);
            res.status(500).json({ error: "Internal server error" })
        }
    })

    // DELETE: Delete a recipe by id
    app.delete("/recipes/:id", async (req, res) => {
        try {
            const recipeId = req.params.id;
            console.log("recipeId: ", recipeId)
            const result = await db.collection("recipes").deleteOne({ _id: new ObjectId(recipeId) });
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: "Recipe not found" });
            }
            res.json({ message: "Recipe deleted successfully. " })
        } catch (e) {
            console.error("Error deleting the recipe: ", error);
            res.status(500).json({ error: "Internal server error" })
        }
    })

    // POST: Add reviews to recipe by id
    app.post('/recipes/:id/reviews', async (req, res) => {
        try {
            const recipeId = req.params.id;
            const { user, rating, comment } = req.body;

            // Basic validation
            if (!user || !rating || !comment) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Create the new review object
            const newReview = {
                review_id: new ObjectId(),
                user,
                rating: Number(rating),
                comment,
                date: new Date()
            };

            // Add the review to the recipe
            const result = await db.collection('recipes').updateOne(
                { _id: new ObjectId(recipeId) },
                { $push: { reviews: newReview } }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ error: 'Recipe not found' });
            }

            res.status(201).json({
                message: 'Review added successfully',
                reviewId: newReview.review_id
            });
        } catch (error) {
            console.error('Error adding review:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // PUT: Update review by reviewId and recipeId
    app.put('/recipes/:recipeId/reviews/:reviewId', async (req, res) => {
        try {
            const recipeId = req.params.recipeId;
            const reviewId = req.params.reviewId;
            const { user, rating, comment } = req.body;

            // Basic validation
            if (!user || !rating || !comment) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Create the updated review object
            const updatedReview = {
                review_id: new ObjectId(reviewId),
                user,
                rating: Number(rating),
                comment,
                date: new Date()  // Update the date to reflect the edit time
            };

            // Update the specific review in the recipe document
            const result = await db.collection('recipes').updateOne(
                {
                    _id: new ObjectId(recipeId),
                    "reviews.review_id": new ObjectId(reviewId)
                },
                {
                    $set: { "reviews.$": updatedReview }
                }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ error: 'Recipe or review not found' });
            }

            res.json({
                message: 'Review updated successfully',
                reviewId: reviewId
            });
        } catch (error) {
            console.error('Error updating review:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

}

main();

// START SERVER
app.listen(3400, () => {
    console.log("Server has started");
});