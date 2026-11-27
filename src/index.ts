import 'dotenv/config';
import app from './app.js';

const port = Number(process.env.PORT) || 3000;

const server = app.listen(port, () => {
  console.log(`Сервер запущен по адресу http://localhost:${port}`);
});

const gracefulShutdown = (signal: string) => {
  console.log(`Получен сигнал ${signal}. Завершаем...`);

  server.close(() => {
    console.log('HTTP-сервер закрыт. Все запросы обработаны.');
    process.exit(0);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
