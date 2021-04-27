const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;

const password = 'IPEGsuSqdeKC0XKe'
const uri = "mongodb+srv://admin-user-node-mongo-db:IPEGsuSqdeKC0XKe@cluster0.vihvh.mongodb.net/burj-al-arab-db?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(bodyParser.json())
app.use(cors())

client.connect(err => {
  const bookdbTable = client.db("burj-al-arab-db").collection("book");
  app.post('/book/store',(req,res) => {
    const newBook = req.body;
    bookdbTable.insertOne(newBook)
    .then(result => {
        console.log(result);
    })
  })

  app.get('/booking',(req,res) => {
        console.log(req.headers.authorization);
        const queryEmail = req.query.email
        bookdbTable.find({email : queryEmail})
        .toArray((arr,doc) => {
            res.send(doc);
        })
  })
});


app.get('/',(req,res) => {
    res.send('Your server is running!');
})

app.listen(4000);