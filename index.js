import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { registerValidation, loginValidation } from './validations/auth.js';

import {checkAuth } from './utils/index.js';


import { UserController, TaskController } from './controllers/index.js';

const DB_URL = "mongodb+srv://MykytaChaika:hyper2003@todolist.he0tlqk.mongodb.net/todolist?retryWrites=true&w=majority"

mongoose
  .connect(DB_URL)
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());


app.post('/auth/login', loginValidation, UserController.login);
app.post('/auth/register', registerValidation, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);


app.get('/', (req, res) =>  {
    res.send('Hello world!');
});


app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server OK');
})