const express = require('express');
const cors = require('cors');
app = express()
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());





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
        const categoryCollection = client.db('artscraftDB').collection('category');

        app.get('/user/artscraft/:email', async (req, res) => {
            const email = req.params.email;

            const query = { email };
            const cursor = artsCraftsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/artscraft/:category', async (req, res) => {
            const category = req.params.category;
            const query = { sub_catagory: category };
            const cursor = artsCraftsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/artscraft/getexistingdata/:id', async (req, res) => {
            const id = req.params.id
            query = { _id: new ObjectId(id) }
            const result = await artsCraftsCollection.findOne(query);
            res.send(result);
        })


        app.get('/artscraft', async (req, res) => {
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

        app.get('/category', async (req, res) => {
            const cursor = categoryCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/category', async (req, res) => {
            const category = req.body.category.toUpperCase();
            console.log(req.body);
            console.log(category);
            const query = { category };
            const exists = await categoryCollection.findOne(query);
            if (!exists) {
                const result = await categoryCollection.insertOne({ category });
                res.send(result);

            }
        })

        app.post('/user', async (req, res) => {
            const user = req.body;
            console.log(user);
            const query = { email: user.email };
            const exists = await userCollection.findOne(query);
            if (!exists) {
                const result = await userCollection.insertOne(user);
                res.send(result);
                return
            }else{
                res.send({status:'already exists'})
            }

        })



        app.get('/user', async (req, res) => {
            const cursor = userCollection.find();
            const users = await cursor.toArray();
            res.send(users);
        })

        app.delete('/artscraft/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await artsCraftsCollection.deleteOne(query);
            res.send(result);
        })


        app.put('/artscraft/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateArts = req.body;
            const arts = {
                $set: {
                    name: updateArts.name,
                    price: updateArts.price,
                    rating: updateArts.rating,
                    customization: updateArts.customization,
                    stock: updateArts.stock,
                    description: updateArts.description, photo: updateArts.photo,
                    userName: updateArts.userName,
                    email: updateArts.email,
                    time: updateArts.time,
                    sub_catagory: updateArts.sub_catagory
                }
            }
            const result = await artsCraftsCollection.updateOne(filter, arts, options);
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
    res.send('Painting and Drawing')
})
app.listen(port, () => {
    console.log(`Painting and drawing server is running on port : ${port}`);
})