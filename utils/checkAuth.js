import jwt from 'jsonwebtoken';

// Функция для проверки авторизации пользователя для получения информации. 
export default (req, res, next) => { 
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, ''); // Вырезаем token из запроса

  if (token) {
    try {
      const decoded = jwt.verify(token, 'secretcode'); // Расшифровываем информацию

      req.userId = decoded._id;
      next();
    } catch (e) {
      return res.status(403).json({
        message: 'Нет доступа',
      });
    }
  } else {
    return res.status(403).json({
      message: 'Нет доступа',
    });
  }
};