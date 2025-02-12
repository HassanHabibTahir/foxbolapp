export interface Note {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteFormData {
  content: string;
}