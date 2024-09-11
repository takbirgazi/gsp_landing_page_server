const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());

// Mongodb
const uri = `mongodb+srv://${process.env.mongoDbUser}:${process.env.mongoDbPassword}@cluster0.eklml.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // client.connect();
        const database = client.db("gsp_landing_page");
        const user = database.collection("users");
        const projects = database.collection("projects");
        //API
        app.get("/users", async (req, res) => {
            const allUser = await user.find().toArray();
            res.send(allUser);
        });
        app.get("/allprojects", async (req, res) => {
            const allProject = await projects.find().toArray();
            res.send(allProject);
        })
        app.post("/addprojects", async (req, res) => {
            const data = req.body;
            projects.insertOne(data);
            res.send("Projects Added");
        });
        app.get("/allprojects/:category", async (req, res) => {
            const projectCategory = req.params.category;
            const query = { projectCategory };
            const result = await projects.find(query).toArray();
            res.send(result)
        });

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);
// Mongodb

app.get("/", (req, res) => {
    res.send("Welcome...");
});
app.listen(port, () => {
    console.log(`Server is running at ${port}`);
})