import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';

export const register = async (req, res) => {
    try {
        const password = req.body.password; // getting password from request
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt); // hashing password with salt

        const doc = new UserModel({ 
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            }, 
            'secretcode',
            {
                expiresIn: '30d',
            },
        );

        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться',
        });
    }
};

export const login = async (req, res) => {
    try {
      const user = await UserModel.findOne({ email: req.body.email }); // Поиск пользователя по почте
  
      if (!user) { // Если пользователя нет, выкидываем ошибку
        return res.status(404).json({
          message: 'Пользователь не найден',
        });
      }
  
      const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash); // Сравнение паролей
  
      if (!isValidPass) { // Если пароль не подошел
        return res.status(400).json({
          message: 'Неверный логин или пароль',
        });
      }
  
      const token = jwt.sign( // Если всё ок, создаем токен
        {
          _id: user._id,
        },
        'secretcode',
        {
          expiresIn: '30d',
        },
      );
  
      const { passwordHash, ...userData } = user._doc;
  
      res.json({ 
        ...userData,
        token,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось авторизоваться',
      });
    }
};
  
  export const getMe = async (req, res) => { // Получение информации о себе
    try {
      const user = await UserModel.findById(req.userId);
  
      if (!user) {
        return res.status(404).json({
          message: 'Пользователь не найден',
        });
      }
  
      const { passwordHash, ...userData } = user._doc;
  
      res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Нет доступа',
      });
    }
};