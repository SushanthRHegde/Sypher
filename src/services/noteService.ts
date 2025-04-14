import {getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
// Firebase configuration object
import {firebaseConfig} from '../lib/firebase'
const app = initializeApp(firebaseConfig);
// Initialize Firestore
const db = getFirestore(app);

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const NOTES_COLLECTION = 'notes';

export const noteService = {
  async createNote(noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const now = Timestamp.now();
    await addDoc(collection(db, NOTES_COLLECTION), {
      ...noteData,
      createdAt: now,
      updatedAt: now,
    });
  },

  async updateNote(noteId: string, updates: Partial<Omit<Note, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
    const noteRef = doc(db, NOTES_COLLECTION, noteId);
    await updateDoc(noteRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  },

  async deleteNote(noteId: string): Promise<void> {
    const noteRef = doc(db, NOTES_COLLECTION, noteId);
    await deleteDoc(noteRef);
  },

  async getUserNotes(userId: string): Promise<Note[]> {
    const notesQuery = query(
      collection(db, NOTES_COLLECTION),
      where('userId', '==', userId)
    );

    const snapshot = await getDocs(notesQuery);
    const notes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Note[];
    
    return notes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },
};