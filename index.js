const express = require("express");
const cors = require("cors");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());

//mongobd connection
const uri =
  "mongodb+srv://SAMS_Server:ijvA1gq2zd99tCsH@cluster0.lsyvijc.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const noticesCollection = client.db("SAMS").collection("Notices");
    const clubsCollection = client.db("SAMS").collection("Clubs");
    const activityCollection = client.db("SAMS").collection("Activities");
    const userCollection = client.db("SAMS").collection("Users");
    const meetingCollection = client.db("SAMS").collection("Meetings");
    const voteCollection = client.db("SAMS").collection("Vote");
    const festiveCollection = client.db("SAMS").collection("Festive");
    const blogCollection = client.db("SAMS").collection("Blog");
    const presidentSelectionCollection = client
      .db("SAMS")
      .collection("President");

    //post a club
    app.post("/clubs", async (req, res) => {
      const club = req.body;
      const result = await clubsCollection.insertOne(club);
      res.send(result);
    });

    //get clubs
    app.get("/clubs", async (req, res) => {
      const query = {};
      const cursor = clubsCollection.find(query);
      const pets = await cursor.toArray();
      res.send(pets);
    });

    //delete club
    app.delete("/clubs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await clubsCollection.deleteOne(query);
      res.send(result);
    });

    //post a notice
    app.post("/notices", async (req, res) => {
      const pet = req.body;
      const result = await noticesCollection.insertOne(pet);
      res.send(result);
    });

    //get all notices
    app.get("/notices", async (req, res) => {
      let query = {};
      if (req.query.club_name) {
        query = {
          club_name: req.query.club_name,
        };
      }
      const cursor = noticesCollection.find(query);
      const pets = await cursor.toArray();
      res.send(pets);
    });

    //delete a notice
    app.delete("/notices/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await noticesCollection.deleteOne(query);
      res.send(result);
    });

    //post a activity
    app.post("/activity", async (req, res) => {
      const pet = req.body;
      const result = await activityCollection.insertOne(pet);
      res.send(result);
    });

    //get all activity
    app.get("/activity", async (req, res) => {
      let query = {};
      if (req.query.club_name) {
        query = {
          club_name: req.query.club_name,
        };
      }
      const cursor = activityCollection.find(query);
      const pets = await cursor.toArray();
      res.send(pets);
    });
    //delete a activity
    app.delete("/activity/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await activityCollection.deleteOne(query);
      res.send(result);
    });

    //post a user
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    //get users or individual a user
    app.get("/user", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      } else if (req.query.club_name) {
        query = {
          club_name: req.query.club_name,
        };
      }
      const cursor = userCollection.find(query);
      const user = await cursor.toArray();
      res.send(user);
    });

    //update user role
    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updatedDoc = {
        $set: {
          isPresident: true,
        },
      };
      const result = await userCollection.updateOne(filter, updatedDoc, option);
      res.send(result);
    });

    //delete a activity
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    //post a meeting
    app.post("/meetings", async (req, res) => {
      const meeting = req.body;
      const result = await meetingCollection.insertOne(meeting);
      res.send(result);
    });

    //meeting get api
    app.get("/meetings", async (req, res) => {
      let query = {};
      if (req.query.club_name) {
        query = {
          club_name: req.query.club_name,
        };
      }
      const cursor = meetingCollection.find(query);
      const pets = await cursor.toArray();
      res.send(pets);
    });

    //delete a meeting
    app.delete("/meetings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await meetingCollection.deleteOne(query);
      res.send(result);
    });

    //post a meeting
    app.post("/decision", async (req, res) => {
      const user = req.body;
      const query = {
        email: user.email,
      };

      const alreadyPosted = await presidentSelectionCollection
        .find(query)
        .toArray();
      if (alreadyPosted.length) {
        const message = `You have already requested!`;
        return res.send({ acknowledged: false, message });
      }
      const result = await presidentSelectionCollection.insertOne(user);
      res.send(result);
    });

    //meeting get api
    app.get("/decision", async (req, res) => {
      let query = {};
      if (req.query.club_name) {
        query = {
          club_name: req.query.club_name,
        };
      }
      const cursor = presidentSelectionCollection.find(query);
      const pets = await cursor.toArray();
      res.send(pets);
    });

    //post your vote
    app.post("/vote", async (req, res) => {
      const vote = req.body;
      const query = {
        user_email: vote.user_email,
      };

      const alreadyVoted = await voteCollection
        .find(query)
        .toArray();
      if (alreadyVoted.length) {
        const message = `You have already voted!`;
        return res.send({ acknowledged: false, message });
      }
      const result = await voteCollection.insertOne(vote);
      res.send(result);
    });

    app.get("/vote", async (req, res) => {
      let query = {};
      if (req.query.club_name) {
        query = {
          club_name: req.query.club_name,
        };
      }
      const cursor = voteCollection.find(query);
      const votes = await cursor.toArray();
      res.send(votes);
    });

    //festive request post api
    app.post("/festive", async (req, res) => {
      const festive = req.body;
      const result = await festiveCollection.insertOne(festive);
      res.send(result);
    });

    //get festive
    app.get("/festive", async(req, res)=>{
      const query = {};
      const result = await festiveCollection.find(query).toArray();
      res.send(result);
    })

    //update festive approval
    app.put("/festive/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updatedDoc = {
        $set: {
          isApprove: true,
        },
      };
      const result = await festiveCollection.updateOne(filter, updatedDoc, option);
      res.send(result);
    });

    //festive request post api
    app.post("/blog", async (req, res) => {
      const blog = req.body;
      const result = await blogCollection.insertOne(blog);
      res.send(result);
    });

    //get blog data
    app.get("/blog", async (req, res) => {
      let query = {};
      if (req.query.club_name) {
        query = {
          club_name: req.query.club_name,
        };
      }
      const cursor = blogCollection.find(query);
      const blogs = await cursor.toArray();
      res.send(blogs);
    });
    // =========================================
    // =========================================
    // =========================================
    //pets details api
    app.get("/pets/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const petDetails = await petsCollection.findOne(query);
      res.send(petDetails);
    });
  } finally {
  }
}

run().catch((e) => console.error(e));

app.get("/", (req, res) => {
  res.send("Student Association Management System Server is Running");
});

app.listen(port, () => {
  console.log(`Student Association Management System Server on ${port}`);
});
