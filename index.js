const express = require('express')
var MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());

var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.u39pp.mongodb.net:27017,cluster0-shard-00-01.u39pp.mongodb.net:27017,cluster0-shard-00-02.u39pp.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-8558zv-shard-0&authSource=admin&retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("glassyMart");
    const allUsers = database.collection('users');
    const allServices = database.collection("services");
    const allOrders = database.collection("orders");

    // post service
    app.post('/services', async (req, res) => {
      console.log('done');
      const data = req.body;
      const result = await allServices.insertOne(data);
      res.send(result);
    })

    // get services
    app.get('/services', async (req, res) => {
      const result = await allServices.find({}).toArray();
      res.send(result);
    })

    // get single service using query
    app.get('/singleService/:id', async (req, res) => {
      const result = await allServices.findOne({ _id: ObjectId(req.params.id) });
      res.send(result);
      console.log('got single data');
    })

    // post order data
    app.post('/orders', async (req, res) => {
      const data = req.body;
      const result = await allOrders.insertOne(data);
      res.send(result);
      console.log('posted data');
    })
    // get order data
    app.get('/orders', async (req, res) => {
      const result = await allOrders.find({}).toArray();
      res.send(result);
    })

    //
    app.post('/users', async (req, res) => {
      const data = req.body;
      const result = await allUsers.insertOne(data);
      res.send(result);
      console.log('posted data');
    })


  }
  finally {
    //await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
  res.send('Hello glassy store!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})