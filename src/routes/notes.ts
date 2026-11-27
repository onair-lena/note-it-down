import { Router } from 'express';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notes.js';

const notesRouter = Router();

notesRouter.get('/', getNotes);
notesRouter.post('/', createNote);
notesRouter.patch('/:id', updateNote);
notesRouter.delete('/:id', deleteNote);

export default notesRouter;
