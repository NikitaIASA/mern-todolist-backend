import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const DB_URL = "mongodb+srv://MykytaChaika:hyper2003@todolist.he0tlqk.mongodb.net/?retryWrites=true&w=majority"

mongoose
  .connect(DB_URL)
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

app.get('/', (req, res) =>  {
    res.send('Hello world!');
});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server OK');
})