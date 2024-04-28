const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.POTTERY_USER_DB}:${process.env.POTTERY_SECRET_KEY}@cluster0.zzqeakj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const potteryCollection = client.db("potteryDB").collection("potteries");

    //data items read
    app.get('/potteries', async (req, res) => {
      const cursor = potteryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/potteries/:id', async(req,res) =>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await potteryCollection.findOne(query);
      res.send(result);
    })

    //pottery items create
    app.post('/potteries', async (req, res) => {
      const newPottery = req.body;
      const result = await potteryCollection.insertOne(newPottery);
      res.send(result);
    })



    app.get("/addList/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await potteryCollection.find({ email: req.params.email }).toArray();
      res.send(result);
    })

    app.get('/singleDetail/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await potteryCollection.findOne(query);
      res.send(result);
    })


    app.put('/updatePottery/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedPottery = req.body;

      const pottery = {
          $set: {
              image: updatedPottery.image,
              item_name: updatedPottery.item_name,
              subcategory: updatedPottery.subcategory,
              price: updatedPottery.price,
              rating: updatedPottery.rating,
              customize: updatedPottery.customize,
              time: updatedPottery.time,
              stockStatus: updatedPottery.stockStatus,
              description: updatedPottery.description
          }
      }

      const result = await potteryCollection.updateOne(filter, pottery, options);
      res.send(result);
  })



    app.delete('/delete/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await potteryCollection.deleteOne(query);
      res.send(result);
    })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('SIMPLE CRUD IS RUNNING');
})

app.listen(port, () => {
  console.log(`SIMPLE CRUD is running on port, ${port}`);
})

