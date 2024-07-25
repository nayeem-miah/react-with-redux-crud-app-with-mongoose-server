const express = require('express');
const cors = require('cors');
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY || 'key-yourkeyhere' });


const port = process.env.PORT || 5000;


// app.use(
//     cors({
//         origin: ["http://localhost:5173/", 'https://nayeemportfolio-70.web.app/','https://nayeemportfolio-70.firebaseapp.com/'],
//     })
// );
app.use(express.json())
app.use(cors())


// console.log(process.env.DB_USER);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bomlehy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // collection------------------------
        messageCollection = client.db("NayeemDB").collection("message");
        app.post('/message', async (req, res) => {
            const newMessage = req.body;

            console.log(newMessage.name);
            const result = await messageCollection.insertOne(newMessage);
            // user send email

            mg.messages.create(process.env.MAILGUN_SENDING_DOMAIN, {
                from: "Excited User <mailgun@sandbox62bb8720f9ed4aa08584de728d683d35.mailgun.org>",
                to: ["nayeem5113a@gmail.com"],
                subject: "Nayeem Contact You",
                text: "Testing some Mailgun awesomeness!",
                html: `
                <div>
                <h3>Name is ${newMessage?.name}</h3>
                <h3>email is ${newMessage?.email}</h3>
                <p>message is: ${newMessage?.message}</p>
              </div>`
            })
                .then(msg => console.log(msg))
                .catch(err => console.log(err));
            res.send(result)
        })
        app.get("/message", async (req, res) => {
            const result = await messageCollection.find().toArray();
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
    res.send('my-persional-Portfolio is running ')
})

app.listen(port, () => {
    console.log(`my-persional-Portfolio is running  on port ${port}`)
})