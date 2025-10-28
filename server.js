const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(helmet());
app.use(cors({ origin: 'https://yourdomain.example' }));
app.use(bodyParser.json());

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 5, // 5 запросов в минуту с одного IP
  message: 'Слишком много заявок, попробуйте позже.'
});
app.use('/api/leads', limiter);

app.post('/api/leads', (req, res) => {
  const { name, company, position, email, phone, vacancies, interest, consent } = req.body;
  // Серверная валидация
  if (
    !name || !company || !position || !email || !phone || !interest || !consent ||
    !/^[a-zA-Zа-яА-Я\s]+$/.test(name) ||
    !/^[^@]+@[^@]+\.[^@]+$/.test(email) ||
    !/^\+?[0-9\-\s\(\)]{7,}$/.test(phone)
  ) {
    return res.status(400).json({ error: 'Некорректные данные.' });
  }
  // TODO: Сохранять в базу или отправлять на email
  res.json({ success: true });
});

app.listen(3000, () => console.log('API запущен на 3000'));