const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

// middleware

app.use(cors())
app.use(express.json())



console.log(process.env.DB_PASS)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uk4bnzw.mongodb.net/?retryWrites=true&w=majority`;

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

        const serviceCollection = client.db("carDoctor").collection("srevices")
        const bookingCollection = client.db("carDoctor").collection("bookings")
        app.get("/srevices", async (request, response) => {
            const cursor = serviceCollection.find()
            const result = await cursor.toArray();
            response.send(result)
        })



        app.get("/srevices/:id", async (request, response) => {
            const id = request.params.id;
            const query = { _id: new ObjectId(id) }

            const options = {
                // Include only the `title` and `imdb` fields in each returned document
                projection: { title: 1, price: 1, service_id: 1, },
            };



            const result = await serviceCollection.findOne(query, options)
            response.send(result)
        })

        //bookings

        app.get("/bookings", async (request, response) => {
            console.log(request.query.email)
            let query = {}
            if (request.query?.email) {
                query = {email: request.query.email}
            }
            const result = await bookingCollection.find(query).toArray()
            response.send(result)
        })
        app.post("/bookings", async (request, response) => {
            const booking = request.body
            console.log(booking)
            const result = await bookingCollection.insertOne(booking)
            response.send(result)   
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






app.get("/", (request, response) => {
    response.send("doctor is running")
})

app.listen(port, () => {
    console.log(`car doctor Server is running on port ${port}`)
})

