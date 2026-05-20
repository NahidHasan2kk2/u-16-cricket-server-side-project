const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);


const express = require('express')
const cors = require("cors");
const dotenv = require('dotenv')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config();
const app = express()
const port = process.env.PORT

const uri = process.env.MONGODB_URL

app.use(express.json());
app.use(cors());



const client = new MongoClient(uri, {
 serverApi: {
  version: ServerApiVersion.v1,
  strict: true,
  deprecationErrors: true,
 }
});



app.get('/', (req, res) => {
 res.send('Hello World! Nahid')
})



async function run() {
 try {
  // Connect the client to the server	(optional starting in v4.7)
  await client.connect();


  const db = client.db("crickets");
  const facilitiesCollection = db.collection("facilities");

  app.post('/add-facilities', async (req, res) => {
   const facility = req.body
   console.log(facility)
   const result = await facilitiesCollection.insertOne(facility);
   res.send(result)
  })

  app.get('/all-facilities', async (req, res) => {
   // const body = req.body;
   const result = await facilitiesCollection.find().toArray();
   res.send(result)
  })
  app.get('/all-facilities/:id', async (req, res) => {
   const id = req.params.id;
   const result = await facilitiesCollection.findOne({ _id: new ObjectId(id) })
   res.send(result)
  })

  app.patch('/all-facilities/:id', async (req, res) => {
   const id = req.params.id;
   const body = req.body;
   const filter = {
    _id: new ObjectId(id)
   };
   const updateDoc = {
    $set: body
   }
   const result = await facilitiesCollection.updateOne(
    filter, updateDoc
   )
   res.json(result)
  })

  app.delete('/all-facilities/:id', async (req, res) => {
   const id = req.params.id;

   const result = await facilitiesCollection.deleteOne({ _id: new ObjectId(id) });
   res.send(result)
  })


  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
 } finally {

  // await client.close();
 }
}
run().catch(console.dir);

app.listen(port, () => {
 console.log(`Example app listening on port ${port}`)
})
