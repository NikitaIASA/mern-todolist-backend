import TaskModel from '../models/Task.js';

export const createTask = async (req, res) => {
  try {
    const doc = new TaskModel({
      title: req.body.title,
      completed: req.body.completed,
      specialSelected: req.body.specialSelected,
      priority: req.body.priority,
      desc: req.body.desc,
      user: req.userId,
    });
    const task = await doc.save();
    res.json(task);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать задачу',
    });
  }
};

export const removeTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    TaskModel.findOneAndDelete(
      {
        _id: taskId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось удалить задачу',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Задача не найдена',
          });
        }
        res.json({
          success: true,
        });
      },
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить задачу',
    });
  }
};

export const getAllTaks = async (req, res) => {
  try {
    const tasks = await TaskModel.find().populate('user').exec();
    res.json(tasks);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить задачи',
    });
  }
};

export const getOneTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    TaskModel.findOne(
      {
        _id: taskId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось вернуть задачу',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Задача не найдена',
          });
        }
        res.json(doc);
      },
    ).populate('user');
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить задачу',
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    await TaskModel.updateOne(
      {
        _id: taskId,
      },
      {
        title: req.body.title,
        completed: req.body.completed,
        specialSelected: req.body.specialSelected,
        priority: req.body.priority,
        desc: req.body.desc,
        user: req.userId,
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить задачу',
    });
  }
};