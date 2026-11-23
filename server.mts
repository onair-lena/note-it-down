import http, { IncomingMessage, ServerResponse } from 'node:http';

let notes = new Map();
let nextId = 1;

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    const reqMethod = req.method;
    const parsedUrl = new URL(req.url ?? '/', 'http://localhost');
    const path = parsedUrl.pathname;
    const name = parsedUrl.searchParams.get('name');

    res.setHeader('Content-Type', 'application/json');
    if (reqMethod === 'GET') {
      if (path === '/hello') {
        if (!name) {
          res.statusCode = 400;
          return res.end(
            JSON.stringify({ error: 'Query param "name" is required' }),
          );
        }
        return res.end(JSON.stringify({ greeting: `Hello, ${name}!` }));
      }
      if (path === '/') {
        return res.end(JSON.stringify({ message: 'hello' }));
      }
      if (path === '/time') {
        return res.end(JSON.stringify({ time: new Date().toISOString() }));
      }
      if (path === '/notes') {
        return res.end(JSON.stringify(Array.from(notes.values())));
      }
    }
    if (reqMethod === 'POST') {
      if (path === '/notes') {
        let body = '';
        req.on('data', (chunk: Buffer) => {
          body += chunk.toString();
        });

        req.on('end', () => {
          try {
            const parsedNote = JSON.parse(body);
            const id = String(nextId++);
            const newNote = { id, title: parsedNote.title.trim() };
            const title =
              typeof parsedNote.title === 'string'
                ? parsedNote.title.trim()
                : '';
            if (!title) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ error: 'Нет title' }));
            }
            notes.set(id, newNote);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'ok', data: newNote }));
          } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Невалидный JSON' }));
          }
        });
      }
    }

    if (reqMethod === 'DELETE') {
      const parts = path.split('/');
      if (parts.length === 3 && parts[1] === 'notes' && parts[2]) {
        const id = parts[2];
        const isDeleted = notes.delete(id);
        if (!isDeleted) {
          res.statusCode = 404;
          return res.end(
            JSON.stringify({ error: 'Query param "name" is required' }),
          );
        }
        res.writeHead(204, { 'Content-Type': 'application/json' });
        return res.end();
      }
    }
    res.statusCode = 404;
    return res.end(JSON.stringify({ error: 'wrong url' }));
  },
);

server.listen(3000, function () {
  console.log('Сервер запущен по адресу http://localhost:3000');
});
