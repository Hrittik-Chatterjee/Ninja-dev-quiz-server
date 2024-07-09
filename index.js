require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const favicon = require("serve-favicon");
const path = require("path");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

app.use(express.json());
app.use(cors());

const uri = process.env.DATABASE_URL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const quizesDB = client.db("quizesDB");
    const quizesCollection = quizesDB.collection("quizesCollection");

    app.get("/quizes", async (req, res) => {
      const quizesData = quizesCollection.find();
      const result = await quizesData.toArray();
      res.send(result);
    });

    app.get("/quizes/:id", async (req, res) => {
      const id = req.params.id;
      const quizesData = await quizesCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(quizesData);
    });
    console.log("You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.log);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
