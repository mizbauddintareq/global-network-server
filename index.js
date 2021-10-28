const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rvmjj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("volunteer_service");
    const eventCollections = database.collection("events");

    // POST volunteer service
    app.post("/addServices", async (req, res) => {
      const event = req.body;
      const result = await eventCollections.insertOne(event);
      res.send(result);
    });

    // GET all services
    app.get("/allEvents", async (req, res) => {
      const cursor = await eventCollections.find({}).toArray();
      res.send(cursor);
    });

    // GET single services
    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await eventCollections.findOne(query);
      res.send(result);
    });
    // Update event
    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      const options = { upsert: true };
      const query = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          title: updateData.title,
        },
      };
      const result = await eventCollections.updateOne(
        query,
        updateDoc,
        options
      );
      res.json(result);
    });

    // DELETE single service
    app.delete("/event/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await eventCollections.deleteOne(query);
      res.json(result);
      console.log(result);
    });
  } finally {
    // await client?.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
