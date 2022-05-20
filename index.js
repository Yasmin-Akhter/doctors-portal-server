const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();
app.use(cors())
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8i6iv.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const treatmentCollection = client.db("doctorsDB").collection("treatment");
        const bookingCollection = client.db("doctorsDB").collection("booking");

        app.get('/treatment', async (req, res) => {
            const query = {};
            const cursor = treatmentCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.post('/booking', async (req, res) => {
            const newBooking = req.body;
            console.log(newBooking);
            const query = { treatmentName: newBooking.treatmentName, date: newBooking.date, slot: newBooking.slot, patient: newBooking.patient };
            const exists = await bookingCollection.findOne(query);
            if (exists) {
                return res.send({ success: false, newBooking: exists })
            }
            const result = await bookingCollection.insertOne(newBooking);
            res.send({ success: true, result });
        });

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);







app.get('/', (req, res) => {
    res.send('hello doctor');
});
app.listen(port, () => {
    console.log('listening from port', port);
})