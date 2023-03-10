import TaskModel from '../models/Task.js';
import UserModel from '../models/User.js';

export const createTask = async (req, res) => {
  try {
    const {title, desc, completed, specialSelected, priority} = req.body;

   const user = await UserModel.findById(req.userId);
    
    const doc = new TaskModel({
      title,
      completed,
      specialSelected,
      priority,
      desc,
    });

    const task = await doc.save();
    user.tasks.push(task);
    await user.save();
    res.json(task);
    console.log(req);
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Не удалось создать задачу',});
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
    const user = await UserModel.findById(req.userId); 
    user.tasks = user.tasks.filter(t => t._id.toString() !== taskId.toString());
    await user.save();

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить задачу',
    });
  }
};

export const removeAllTasks = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const deletedTasks = await TaskModel.deleteMany({
      _id: { $in: user.tasks },
    });

    user.tasks = [];

    await user.save();

    res.json({
      success: true,
      deletedCount: deletedTasks.deletedCount,
    });
  } catch (err) {
      res.status(500).json({
      message: 'Не удалось удалить задачи',
    });
  }
};

export const removeCompletedTasks = async (req, res) => {
  try {

    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const deletedTasks = await TaskModel.deleteMany({
      _id: { $in: user.tasks },
      completed: true,
    });

    user.tasks = user.tasks.filter((task) => !task.completed);

    await user.save();

    res.json({
      success: true,
      deletedCount: deletedTasks.deletedCount,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось удалить задачи',
    });
  }
};

export const getOneTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await TaskModel.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });
    return res.status(200).json({ task });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// export const getCompletedTasks = async (req, res) => {
//   try {
//     const { status } = req.query;
//     const query = typeof status === 'boolean' ? { completed: status } : {};
//     const tasks = await TaskModel.find(query);
//     return res.status(200).json({ tasks });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

export const getAllTasks = async (req, res) => {
  const match = {};

  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  try {
    const user = await UserModel.findById(req.userId).populate({
      path: 'tasks',
      match
    });
    return res.status(200).json(user.tasks);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await TaskModel.findById(taskId);

    const {title, completed, specialSelected, priority, desc} = req.body;

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    task.title = title;
    task.completed = completed;
    task.specialSelected = specialSelected;
    task.priority = priority;
    task.desc = desc;

    await task.save();

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to update task',
    });
  }
};

export const toggleTaskCompletion = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await TaskModel.findById(taskId);
    task.completed = !task.completed;
    await task.save();

    const user = await UserModel.findById(req.userId);
    await user.save();
    res.json({ message: 'Task completed successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Could not complete task' });
  }
};



