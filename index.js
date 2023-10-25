const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.Port || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0aeevtm.mongodb.net/?retryWrites=true&w=majority`;

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

   const serviceCollection = client.db('carMaster').collection('services');

   app.get('/services', async(req, res) =>{
    const cursor = serviceCollection.find();
    const result = await cursor.toArray();
    res.send(result);
   })

   const cartCollection = client.db('carMaster').collection('cart');
   app.get('/cart', async(req, res) =>{
    const cursor = cartCollection.find();
    const result = await cursor.toArray();
    res.send(result);
   })

   app.get('/cart/:id', async(req, res) =>{
    const id = req.params.id;
    const query = {_id : new ObjectId (id)}
    const result = await cartCollection.findOne(query);
    res.send(result);
   })

   app.post('/cart', async(req, res) =>{
    const newCart  = req.body;
    console.log(newCart);
    const result = await cartCollection.insertOne(newCart);
    res.send(result);
   })

   app.put('/cart/:id', async(req, res) =>{
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const options = {upsert: true};
    const updateCarProduct = req.body;
    const CarProduct = {
      $set: {
        photo: updateCarProduct.photo,
         name: updateCarProduct.name,
          brand: updateCarProduct.brand_name,
           type: updateCarProduct.type,
            description: updateCarProduct.description,
             rating: updateCarProduct.rating,
              price: updateCarProduct.price
      }
    }
    const result = await cartCollection.updateOne(filter, CarProduct, options);
    res.send(result);
   })

   app.delete('/cart/:id', async(req, res) =>{
    const id = req.params.id;
    const query = {_id : new ObjectId (id)}
    const result = await cartCollection.deleteOne(query);
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
    res.send('automotive is running')
})

app.listen(port, () => {
    console.log(`automotive server is running in port ${port}`);
})