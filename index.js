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
    const allReview = database.collection("review");

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

    // add user to database
    app.post('/users', async (req, res) => {
      const data = req.body;
      const result = await allUsers.insertOne(data);
      res.send(result);
      console.log('posted data');
    })

    // delete order
    app.delete('/deleteOrder/:id', async(req, res) => {
      const result = await allOrders.deleteOne({_id:ObjectId(req.params.id)})
      res.send(result);
      console.log('orders deleted');
  })


  // add admin
    app.put('/users/admin', async(req, res) => {
      const user = req.body;
      const filter = {email: user.email};
      const update = {$set: {role: 'admin'}};
      const result = await allUsers.updateOne(filter, update);
      res.send(result)
    })

    // get users
    app.get('/users/:email', async(req, res) => {
      const email = req.params.email;
      const query = {email: email};
      const user = await allUsers.findOne(query);
      let isAdmin = false;
      if(user?.role === 'admin'){
        isAdmin= true;
      }
      res.send({admin: isAdmin});
    })

    // add review
    app.post('/review', async (req, res) => {
      const data = req.body;
      const result = await allReview.insertOne(data);
      res.send(result);
    })

     // get review
     app.get('/review', async (req, res) => {
      const result = await allReview.find({}).toArray();
      res.send(result);
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