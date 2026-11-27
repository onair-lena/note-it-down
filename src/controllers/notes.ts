import type { Request, Response } from 'express';
import { notesData } from '../data/notes.js';

export const getNotes = (req: Request, res: Response) => {
  res.send(notesData.findAll());
};

export const createNote = (req: Request, res: Response) => {
  const title =
    typeof req.body?.title === 'string' ? req.body.title.trim() : '';
  if (!title) {
    return res.status(400).send({ error: 'Нет title' });
  }
  const newNote = notesData.create(title);
  return res.status(201).send({ status: 'ok', data: newNote });
};

export const updateNote = (req: Request, res: Response) => {
  const { id } = req.params;
  if (!notesData.findById(id)) {
    return res.status(404).send({ error: `Заметка с id "${id}" не найдена` });
  }
  const title =
    typeof req.body?.title === 'string' ? req.body.title.trim() : '';
  if (!title) {
    return res.status(400).send({ error: 'Нет title' });
  }
  const updatedNote = notesData.update(id, title);
  return res.status(200).send({ status: 'ok', data: updatedNote });
};

export const deleteNote = (req: Request, res: Response) => {
  const { id } = req.params;
  const isDeleted = notesData.delete(id);
  if (!isDeleted) {
    return res.status(404).send({ error: `Заметка с id "${id}" не найдена` });
  }
  return res.sendStatus(204);
};
