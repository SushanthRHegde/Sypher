import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc, deleteDoc, orderBy, DocumentData, Timestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {firebaseConfig} from '../lib/firebase'
import { initializeApp } from 'firebase/app';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Collection reference
const NOTES_COLLECTION = 'notes';

export interface Note {
  id: string;
  title: string;
  content: string; // Rich text content in markdown format
  excerpt: string;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
  attachments?: {
    url: string;
    type: string;
    name: string;
  }[];
}

// Create a new note
export const createNote = async (userId: string, noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const notesRef = collection(db, NOTES_COLLECTION);
    const noteDoc = doc(notesRef);
    const now = Timestamp.now();

    const newNote: Note = {
      ...noteData,
      id: noteDoc.id,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(noteDoc, newNote);
    return noteDoc.id;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

// Fetch a single note
export const fetchNote = async (noteId: string): Promise<Note | null> => {
  try {
    const noteRef = doc(db, NOTES_COLLECTION, noteId);
    const noteSnap = await getDoc(noteRef);

    if (noteSnap.exists()) {
      const data = noteSnap.data();
      // Ensure timestamps are properly handled
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.now();
      const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt : Timestamp.now();
      
      return {
        id: noteSnap.id,
        title: data.title || '',
        content: data.content || '',
        excerpt: data.excerpt || '',
        tags: data.tags || [],
        createdAt: createdAt,
        updatedAt: updatedAt,
        userId: data.userId,
        attachments: data.attachments || []
      } as Note;
    }
    return null;
  } catch (error) {
    console.error('Error fetching note:', error);
    throw error;
  }
};

// Fetch all notes for a user
export const fetchUserNotes = async (userId: string): Promise<Note[]> => {
  try {
    const notesRef = collection(db, NOTES_COLLECTION);
    const q = query(
      notesRef,
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Ensure timestamps are properly handled
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.now();
      const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt : Timestamp.now();
      
      return {
        id: doc.id,
        title: data.title || '',
        content: data.content || '',
        excerpt: data.excerpt || '',
        tags: data.tags || [],
        createdAt: createdAt,
        updatedAt: updatedAt,
        userId: data.userId,
        attachments: data.attachments || []
      } as Note;
    });
  } catch (error) {
    console.error('Error fetching user notes:', error);
    throw error;
  }
};

// Update a note
export const updateNote = async (noteId: string, updates: Partial<Omit<Note, 'id' | 'createdAt' | 'userId'>>): Promise<void> => {
  try {
    const noteRef = doc(db, NOTES_COLLECTION, noteId);
    await updateDoc(noteRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

// Delete a note
export const deleteNote = async (noteId: string): Promise<void> => {
  try {
    const noteRef = doc(db, NOTES_COLLECTION, noteId);
    await deleteDoc(noteRef);
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

// Upload an attachment
export const uploadAttachment = async (file: File, userId: string): Promise<{ url: string; type: string; name: string }> => {
  try {
    const storage = getStorage();
    const fileRef = ref(storage, `notes/${userId}/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);

    return {
      url,
      type: file.type,
      name: file.name,
    };
  } catch (error) {
    console.error('Error uploading attachment:', error);
    throw error;
  }
};