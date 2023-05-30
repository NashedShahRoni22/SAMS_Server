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
    const activityCollection = client.db("SAMS").collection("Activities");
    const userCollection = client.db("SAMS").collection("Users");
    const meetingCollection = client.db("SAMS").collection("Meetings");
    const presidentSelectionCollection = client.db("SAMS").collection("President");
    
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
      }else if(req.query.club_name){
        query ={
          club_name: req.query.club_name
        }
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
      const result = await presidentSelectionCollection.insertOne(user);
      res.send(result);
    });



    //pets details api
    app.get("/pets/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const petDetails = await petsCollection.findOne(query);
      res.send(petDetails);
    });

    //reviews post api
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.send(result);
    });

    //reviews get api for individual pet card
    app.get("/reviews", async (req, res) => {
      let query = {};
      if (req.query.petId) {
        query = {
          petId: req.query.petId,
        };
      }
      const cursor = reviewsCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    //post of pets get api for idividual user
    app.get("/myposts", async (req, res) => {
      let query = {};
      if (req.query.ownerEmail) {
        query = {
          ownerEmail: req.query.ownerEmail,
        };
      }
      const cursor = petsCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    //reviews get api for idividual user
    app.get("/myreviews", async (req, res) => {
      let query = {};
      if (req.query.userEmail) {
        query = {
          userEmail: req.query.userEmail,
        };
      }
      const cursor = reviewsCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
    //save bookings
    app.post("/bookings", async (req, res) => {
      const bookings = req.body;
      const query = {
        buyerEmail: bookings.buyerEmail,
        productId: bookings.productId,
      };

      const alreadyBooked = await bookingsCollection.find(query).toArray();
      if (alreadyBooked.length) {
        const message = `You have already booked ${bookings.name}!`;
        return res.send({ acknowledged: false, message });
      }
      const result = await bookingsCollection.insertOne(bookings);
      res.send(result);
    });
    //bookings get api for idividual user
    app.get("/mybookings", async (req, res) => {
      let query = {};
      if (req.query.buyerEmail) {
        query = {
          buyerEmail: req.query.buyerEmail,
        };
      }
      const cursor = bookingsCollection.find(query);
      const bookings = await cursor.toArray();
      res.send(bookings);
    });
    //delete a bookings
    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingsCollection.deleteOne(query);
      res.send(result);
    });
    //delete a review
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviewsCollection.deleteOne(query);
      res.send(result);
    });
    //delete a post
    app.delete("/myposts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await petsCollection.deleteOne(query);
      res.send(result);
    });

    //paid product
    app.put("/paidproducts/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updatedDoc = {
        $set: {
          isPaid: true,
        },
      };
      const result = await petsCollection.updateOne(filter, updatedDoc, option);
      res.send(result);
    });
    //paid booking product
    app.put("/paidbookingproducts/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updatedDoc = {
        $set: {
          isPaid: true,
        },
      };
      const result = await bookingsCollection.updateOne(
        filter,
        updatedDoc,
        option
      );
      res.send(result);
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
