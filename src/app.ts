import express, { type Express } from 'express';
import notesRouter from './routes/notes.js';
import miscRouter from './routes/misc.js';

const app: Express = express();

app.use(express.json()); // Глобальный middleware для парсинга JSON
app.use('/notes', notesRouter);
app.use('/', miscRouter); // /hello, /, /time будут доступны от корня

export default app;
