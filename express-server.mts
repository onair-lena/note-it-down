import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from 'express';

interface Note {
  id: string;
  title: string;
}

const app: Express = express();
const port = 3000;

const notes = new Map<string, Note>();
let nextId = 1;

app.use(express.json());

app.get('/hello', (req: Request, res: Response) => {
  const name = req.query.name;
  if (typeof name !== 'string' || !name) {
    return res.status(400).send({ error: 'Query param "name" is required' });
  }
  return res.send({ greeting: `Hello, ${name}!` });
});

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'hello' });
});

app.get('/time', (req: Request, res: Response) => {
  res.send({ time: new Date().toISOString() });
});

app.get('/notes', (req: Request, res: Response) => {
  res.send(Array.from(notes.values()));
});

app.post('/notes', (req: Request, res: Response) => {
  const title =
    typeof req.body?.title === 'string' ? req.body.title.trim() : '';

  if (!title) {
    return res.status(400).send({ error: 'Нет title' });
  }

  const id = String(nextId++);
  const newNote: Note = { id, title };
  notes.set(id, newNote);

  return res.status(201).send({ status: 'ok', data: newNote });
});

app.delete('/notes/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const isDeleted = notes.delete(id);

  if (!isDeleted) {
    return res.status(404).send({ error: `Заметка с id "${id}" не найдена` });
  }

  return res.sendStatus(204);
});

app.patch('/notes/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  if (!notes.has(id)) {
    return res.status(404).send({ error: `Заметка с id "${id}" не найдена` });
  }

  const title =
    typeof req.body?.title === 'string' ? req.body.title.trim() : '';

  if (!title) {
    return res.status(400).send({ error: 'Нет title' });
  }

  const updatedNote: Note = { id, title };
  notes.set(id, updatedNote);

  return res.status(200).send({ status: 'ok', data: updatedNote });
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).send({ error: 'Невалидный JSON' });
  }
  next(err);
});

app.use((req: Request, res: Response) => {
  res.status(404).send({ error: 'wrong url' });
});

app.listen(port, () => {
  console.log(`Сервер запущен по адресу http://localhost:${port}`);
});
