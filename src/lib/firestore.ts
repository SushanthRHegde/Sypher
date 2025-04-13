import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc, deleteDoc, DocumentData } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { ProfileLinks } from '@/components/auth/ProfileLinksDialog';
import { ProfileData } from '@/services/profileService';
// Firebase configuration object
import {firebaseConfig} from '../lib/firebase'
const app = initializeApp(firebaseConfig);
// Initialize Firestore
const db = getFirestore(app);

// Collection references
const PROFILES_COLLECTION = 'profiles';

// Interface for profile document
interface ProfileDocument {
  profileData: ProfileData;
  profileLinks: ProfileLinks;
  updatedAt: string;
  createdAt: string;
}

// Save profile data to Firestore
export const saveProfileData = async (userId: string, profileData: ProfileData, profileLinks: ProfileLinks): Promise<boolean> => {
  try {
    if (!userId || !profileData || !profileLinks) {
      throw new Error('Missing required parameters');
    }

    const userProfileRef = doc(db, PROFILES_COLLECTION, userId);
    const docSnap = await getDoc(userProfileRef);
    const now = new Date().toISOString();

    const profileDoc: ProfileDocument = {
      profileData,
      profileLinks,
      updatedAt: now,
      createdAt: docSnap.exists() ? docSnap.data().createdAt : now
    };

    await setDoc(userProfileRef, profileDoc);
    return true;
  } catch (error) {
    console.error('Error saving profile data:', error);
    throw error;
  }
};

// Fetch profile data from Firestore
export const fetchProfileData = async (userId: string): Promise<ProfileDocument | null> => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const userProfileRef = doc(db, PROFILES_COLLECTION, userId);
    const docSnap = await getDoc(userProfileRef);

    if (docSnap.exists()) {
      return docSnap.data() as ProfileDocument;
    }
    return null;
  } catch (error) {
    console.error('Error fetching profile data:', error);
    throw error;
  }
};

// Update specific profile fields
export const updateProfileFields = async (userId: string, fields: Partial<ProfileDocument>): Promise<boolean> => {
  try {
    if (!userId || !fields) {
      throw new Error('Missing required parameters');
    }

    const userProfileRef = doc(db, PROFILES_COLLECTION, userId);
    await updateDoc(userProfileRef, {
      ...fields,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error updating profile fields:', error);
    throw error;
  }
};

// Delete profile
export const deleteProfile = async (userId: string): Promise<boolean> => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const userProfileRef = doc(db, PROFILES_COLLECTION, userId);
    await deleteDoc(userProfileRef);
    return true;
  } catch (error) {
    console.error('Error deleting profile:', error);
    throw error;
  }
};

// Query profiles by field
export const queryProfiles = async (field: keyof ProfileDocument, value: any): Promise<ProfileDocument[]> => {
  try {
    const profilesRef = collection(db, PROFILES_COLLECTION);
    const q = query(profilesRef, where(field, '==', value));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data() as ProfileDocument);
  } catch (error) {
    console.error('Error querying profiles:', error);
    throw error;
  }
};