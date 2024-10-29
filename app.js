require("dotenv").config()
const express = require("express")
const { MongoClient, ObjectId } = require("mongodb")
const app = express()

const PORT = process.env.PORT
const DB_URL = process.env.DB_URL

// Instantiate a new Mongo Client
const client = new MongoClient(DB_URL)

async function dbConnect() {
    // establishes connection wtih database process
    await client.connect()
    // creates a databse or connects to one if it exists
    const db = await client.db("mongolesson")
    // creates a collection within our new database
    const collection = await db.collection("user")
    return collection
}

app.use(express.json())
app.post("/create", async (req, res) => {
    try {
        console.log(req.body)
        // connect to our database and collection
        const db = await dbConnect()
        // push the contents of the body into our collection as a document
        const entry = await db.insertOne(req.body)
        
        res.status(201).json({
            message: `Created user`,
            entry
        })
        
    } catch(err) {
        res.status(500).json({
            error: `${err}`
        })
    }
})

/* 
? Challenge
* return all values from the user collection back to the client
* this will require a get request
*/

app.get("/", async (_, res) => {
    try {
        const db = await dbConnect()
        const foundAll = await db.find({}).toArray()

        res.status(200).json(foundAll)


    } catch(err) {
        console.error(err)
        res.status(500).json({
            error: `${err}`
        })
    }
})

app.get("/:id", async (req, res) => {
    try {
        const { id } = req.params
        
        const db = await dbConnect()

        const foundItem = await db.findOne({ _id: new ObjectId(id) })
        
        if (!foundItem) throw new Error("Nothing found")

        res.status(200).json(foundItem)

    } catch(err) {
        console.error(err)
        res.status(500).json({
            error: `${err}`
        })
    }
})

app.listen(PORT, () => {
    dbConnect()
    console.log(`[server] listening on ${PORT}`)
})