import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import cors from 'cors';

import { registerValidation, loginValidation, taskCreateValidation } from './validations.js';

import {checkAuth, handleValidationErrors} from './utils/index.js';


import { UserController, TaskController } from './controllers/index.js';

const DB_URL = "mongodb+srv://MykytaChaika:hyper2003@todolist.he0tlqk.mongodb.net/todolist?retryWrites=true&w=majority"

mongoose
  .connect(DB_URL)
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());
app.use(cors());

// AUTH

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register',registerValidation, handleValidationErrors,  UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

// CRUD

app.get('/tasks', checkAuth, TaskController.getAllTasks);
app.get('/tasks/:id',checkAuth ,TaskController.getOneTask);
app.get('/tasks/:status', checkAuth, TaskController.getAllTasks);
app.post('/tasks/:id',checkAuth ,TaskController.toggleTaskCompletion);
app.post('/tasks', checkAuth, taskCreateValidation, handleValidationErrors, TaskController.createTask);
app.delete('/tasks/:id', checkAuth, TaskController.removeTask);
app.delete('/tasks', checkAuth, TaskController.removeAllTasks);
app.delete('/tasks-done', checkAuth, TaskController.removeCompletedTasks);
app.patch(
    '/tasks/:id',
    checkAuth,
    taskCreateValidation,
    handleValidationErrors,
    TaskController.updateTask,
  );



app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server OK');
})