import { initializeApp } from 'firebase/app';
import {firebaseConfig} from '../lib/firebase'
const app = initializeApp(firebaseConfig);
// Initialize Firestore
const db = getFirestore(app);
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';

// Forum Types
interface ForumPost {
  id?: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  category: string;
  createdAt: Date;
  likes: number;
  comments: number;
  views: number;
}

// Study Group Types
interface StudyGroup {
  id?: string;
  name: string;
  description: string;
  category: string;
  createdBy: string;
  maxMembers: number;
  meetingSchedule?: string;
  topics: string[];
  members: string[];
  createdAt: Date;
}

// Code Review Types
interface CodeReview {
  id?: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  language: string;
  status: 'pending' | 'in-review' | 'completed';
  createdAt: Date;
  codeSnippet: string;
  reviewers: string[];
  commentCount: number;
}

// Forum Functions
export const createForumPost = async (post: Omit<ForumPost, 'id' | 'likes' | 'comments' | 'views'>) => {
  try {
    const postData = {
      ...post,
      likes: 0,
      comments: 0,
      views: 0,
      createdAt: new Date()
    };
    const docRef = await addDoc(collection(db, 'forum_posts'), postData);
    return { id: docRef.id, ...postData };
  } catch (error) {
    console.error('Error creating forum post:', error);
    throw error;
  }
};

export const getForumPosts = async (category?: string) => {
  try {
    let q = query(
      collection(db, 'forum_posts'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    if (category) {
      q = query(q, where('category', '==', category));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    throw error;
  }
};

// Study Group Functions
export const createStudyGroup = async (group: Omit<StudyGroup, 'id' | 'createdAt'>) => {
  try {
    const groupData = {
      ...group,
      createdAt: new Date(),
      members: [group.createdBy] // Creator is the first member
    };
    const docRef = await addDoc(collection(db, 'study_groups'), groupData);
    return { id: docRef.id, ...groupData };
  } catch (error) {
    console.error('Error creating study group:', error);
    throw error;
  }
};

export const getStudyGroups = async () => {
  try {
    const q = query(
      collection(db, 'study_groups'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching study groups:', error);
    throw error;
  }
};

// export const joinStudyGroup = async (groupId: string, userId: string) => {
//   try {
//     const groupRef = doc(db, 'study_groups', groupId);
//     await updateDoc(groupRef, {
//       members: [...(await getStudyGroups()).find(g => g.id === groupId)?.members || [], userId]
//     });
//   } catch (error) {
//     console.error('Error joining study group:', error);
//     throw error;
//   }
// };

// Code Review Functions
export const createCodeReview = async (review: Omit<CodeReview, 'id' | 'commentCount' | 'status'>) => {
  try {
    const reviewData = {
      ...review,
      status: 'pending' as const,
      commentCount: 0,
      createdAt: new Date()
    };
    const docRef = await addDoc(collection(db, 'code_reviews'), reviewData);
    return { id: docRef.id, ...reviewData };
  } catch (error) {
    console.error('Error creating code review:', error);
    throw error;
  }
};

export const getCodeReviews = async (status?: CodeReview['status']) => {
  try {
    let q = query(
      collection(db, 'code_reviews'),
      orderBy('createdAt', 'desc')
    );

    if (status) {
      q = query(q, where('status', '==', status));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching code reviews:', error);
    throw error;
  }
};

export const updateCodeReviewStatus = async (reviewId: string, status: CodeReview['status']) => {
  try {
    const reviewRef = doc(db, 'code_reviews', reviewId);
    await updateDoc(reviewRef, { status });
  } catch (error) {
    console.error('Error updating code review status:', error);
    throw error;
  }
};