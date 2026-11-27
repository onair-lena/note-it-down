import { Router } from 'express';
import type { Request, Response } from 'express';

const miscRouter = Router();

miscRouter.get('/hello', (req: Request, res: Response) => {
  const name = req.query.name;
  if (typeof name !== 'string' || !name) {
    return res.status(400).send({ error: 'Query param "name" is required' });
  }
  return res.send({ greeting: `Hello, ${name}!` });
});

miscRouter.get('/', (req: Request, res: Response) => {
  res.send({ message: 'hello' });
});

miscRouter.get('/time', (req: Request, res: Response) => {
  res.send({ time: new Date().toISOString() });
});

export default miscRouter;
