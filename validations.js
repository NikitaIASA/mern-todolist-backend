import { body } from "express-validator";

export const registerValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
  body("fullName", "Укажите имя").isLength({ min: 3 }),
  body("avatarUrl", "Неверная ссылка на аватарку").optional().isURL(),
];

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
];

export const taskCreateValidation = [
  body('title', 'Введите название задачи').isLength({ min: 3 }).isString(),
  body('desc', 'Введите описание задачи').isLength({ min: 3 }).isString(),
  body('completed').isBoolean(),
  body('specialSelected').isBoolean(),
  body('priority').optional().isString(),
  body('desc').isString(),
];

