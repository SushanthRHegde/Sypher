import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import {firebaseConfig} from '../lib/firebase'
const app = initializeApp(firebaseConfig);
// Initialize Firestore
const db = getFirestore(app);

export interface Goal {
  deadline: Date;
  id: string;
  title: string;
  description: string;
  completed: boolean;
  type: 'daily' | 'weekly';
  streak: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  completionHistory: Date[];
}

const GOALS_COLLECTION = 'goals';

export const goalService = {
  // Create a new goal
  async createGoal(goalData: Omit<Goal, 'id' | 'completed' | 'streak' | 'createdAt' | 'updatedAt'>) {
    try {
      const goalRef = await addDoc(collection(db, GOALS_COLLECTION), {
        ...goalData,
        completed: false,
        streak: 0,
        completionHistory: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return goalRef.id;
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  },

  // Get all goals for a user
  async getUserGoals(userId: string) {
    try {
      const q = query(collection(db, GOALS_COLLECTION), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as Goal[];
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  },

  // Update a goal
  async updateGoal(goalId: string, updates: Partial<Goal>) {
    try {
      const goalRef = doc(db, GOALS_COLLECTION, goalId);
      const goalDoc = await getDoc(goalRef);
      const currentGoal = goalDoc.data() as Goal;
      
      // If completing the goal, update completion history and streak
      if (updates.completed && !currentGoal.completed) {
        const now = new Date();
        const newCompletionHistory = [...(currentGoal.completionHistory || []), now];
        const newStreak = this.calculateStreak(
          { ...currentGoal, completionHistory: newCompletionHistory },
          newCompletionHistory
        );
        
        await updateDoc(goalRef, {
          ...updates,
          completionHistory: newCompletionHistory,
          streak: newStreak,
          updatedAt: now,
        });
      } else {
        await updateDoc(goalRef, {
          ...updates,
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  },

  // Delete a goal
  async deleteGoal(goalId: string) {
    try {
      const goalRef = doc(db, GOALS_COLLECTION, goalId);
      await deleteDoc(goalRef);
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  },

  // Calculate streak for a goal
  calculateStreak(goal: Goal, completionHistory: Date[]): number {
    if (!completionHistory.length) return 0;

    let streak = 0;
    const today = new Date();
    const sortedHistory = [...completionHistory].sort((a, b) => b.getTime() - a.getTime());

    if (goal.type === 'daily') {
      // Check daily streak
      let currentDate = today;
      for (const date of sortedHistory) {
        if (this.isSameDay(date, currentDate)) {
          streak++;
          currentDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
        } else break;
      }
    } else {
      // Check weekly streak
      let currentWeek = this.getWeekNumber(today);
      for (const date of sortedHistory) {
        if (this.getWeekNumber(date) === currentWeek) {
          streak++;
          currentWeek--;
        } else break;
      }
    }

    return streak;
  },

  // Helper function to check if two dates are the same day
  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  },

  // Helper function to get week number
  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  },
};