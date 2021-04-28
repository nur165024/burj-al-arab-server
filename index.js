const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
var admin = require("firebase-admin");
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vihvh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(bodyParser.json())
app.use(cors())


var serviceAccount = require("./burj-al-arab-e3cc6-firebase-adminsdk-wsbk4-af984725c8.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


client.connect(err => {
  const bookdbTable = client.db(`${process.env.DB_NAME}`).collection("book");
  app.post('/book/store', (req, res) => {
    const newBook = req.body;
    bookdbTable.insertOne(newBook)
      .then(result => {
        console.log(result);
      })
  })

  app.get('/booking', (req, res) => {
    const bearer = req.headers.authorization;

    if (bearer && bearer.startsWith('Bearer ')) {
      const idToken = bearer.split(' ')[1]

      admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
          const tokenEmail = decodedToken.email;
          const queryEmail = req.query.email;
          if (tokenEmail === queryEmail) {
            bookdbTable.find({ email: queryEmail })
              .toArray((arr, doc) => {
                res.send(doc);
                res.status(200)
              })
          }
        })
        .catch((error) => {
          res.status(401).send('un-authorized access')
        })
    }else{
      res.status(401).send('un-authorized access')
    }
  })
});


app.get('/', (req, res) => {
  res.send('Your server is running!');
})

app.listen(4000);