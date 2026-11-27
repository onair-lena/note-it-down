import express, {
  type Express,
  type Request,
  type Response,
  NextFunction,
} from 'express';
import notesRouter from './routes/notes.js';
import miscRouter from './routes/misc.js';

const app: Express = express();

app.use(express.json());

app.use('/notes', notesRouter);
app.use('/', miscRouter);

app.use((req: Request, res: Response) => {
  res.status(404).send({ error: 'Wrong url' });
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).send({
      error: 'Невалидный JSON',
    });
  }

  return next(err);
});

export default app;
