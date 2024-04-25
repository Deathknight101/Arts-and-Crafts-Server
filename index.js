const express = require('express');
const cors = require('cors');
app = express()
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());

//paintingMaster
//ERY4IbkpSJfqiW71

console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ktqmnde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();


        const artsCraftsCollection = client.db('artscraftDB').collection('arts');
        const userCollection = client.db('artscraftDB').collection('user');
        const userArtsCraftsCollection = client.db('artscraftDB').collection('userartscraft')

        app.get('/userartscraft',async(req,res)=>{
            const cursor = userArtsCraftsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/userartscraft', async (req, res) => {
            console.log('hit');
            const newArts = req.body;
            console.log(newArts);
            const result = await userArtsCraftsCollection.insertOne(newArts);
            res.send(result);
        })
        app.get('/artscraft',async(req,res)=>{
            const cursor = artsCraftsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/artscraft', async (req, res) => {
            const newArts = req.body;
            console.log(newArts);
            const result = await artsCraftsCollection.insertOne(newArts);
            res.send(result);
        })

        app.post('/user',async(req,res)=>{
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        })
        
        app.get('/user',async(req,res)=>{
            const cursor = userCollection.find();
            const users = await cursor.toArray();
            res.send(users);
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
    res.send('Painting and Drawing')
})
app.listen(port, () => {
    console.log(`Painting and drawing server is running on port : ${port}`);
})