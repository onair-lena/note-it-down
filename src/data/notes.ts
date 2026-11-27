export interface Note {
  id: string;
  title: string;
}

const notes = new Map<string, Note>();
let nextId = 1;

export const notesData = {
  findAll: (): Note[] => Array.from(notes.values()),
  findById: (id: string): Note | undefined => notes.get(id),
  create: (title: string): Note => {
    const id = String(nextId++);
    const newNote: Note = { id, title };
    notes.set(id, newNote);
    return newNote;
  },
  update: (id: string, title: string): Note | undefined => {
    if (!notes.has(id)) return undefined;
    const updatedNote: Note = { id, title };
    notes.set(id, updatedNote);
    return updatedNote;
  },
  delete: (id: string): boolean => notes.delete(id),
};
