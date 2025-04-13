import { useState, useEffect } from 'react';
import { Calendar, Target, Trophy, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Goal, goalService } from '@/services/goalService';
import CreateGoalModal from '@/components/goals/CreateGoalModal';
import GoalCard from '@/components/goals/GoalCard';

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    try {
      const userGoals = await goalService.getUserGoals(user!.uid);
      setGoals(userGoals);
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const handleCreateGoal = async (goalData: Omit<Goal, 'id' | 'completed' | 'streak' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      await goalService.createGoal({
        ...goalData,
        userId: user!.uid,
      });
      loadGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      if (goal) {
        const now = new Date();
        const updatedHistory = goal.completionHistory || [];
        if (!goal.completed) {
          updatedHistory.push(now);
        }
        await goalService.updateGoal(goalId, { 
          completed: !goal.completed,
          completionHistory: updatedHistory,
          updatedAt: now
        });
        loadGoals();
      }
    } catch (error) {
      console.error('Error completing goal:', error);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await goalService.deleteGoal(goalId);
      loadGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-14 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-sypher-accent">Goals & Progress</h1>
        <Button
          variant="default"
          className="bg-sypher-accent hover:bg-sypher-accent/90 w-full sm:w-auto"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Target className="mr-2 h-4 w-4" />
          Create New Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Active Goals Section */}
        <div className="glass-card p-4 sm:p-6 rounded-lg">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
            <Target className="mr-2" /> Active Goals
          </h2>
          {goals.length === 0 ? (
            <p className="text-gray-400">No active goals. Create one to get started!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onComplete={handleCompleteGoal}
                  onDelete={handleDeleteGoal}
                />
              ))}
            </div>
          )}
        </div>

        {/* Progress Tracking Section */}
   
      </div>

      {/* Notifications Section */}
      <div className="mt-6 sm:mt-8 glass-card p-4 sm:p-6 rounded-lg">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
          <Bell className="mr-2" /> Notifications & Reminders
        </h2>
        <div className="space-y-4">
          <p className="text-gray-400">No active notifications</p>
          {/* Notifications list will go here */}
        </div>
      </div>

      <CreateGoalModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateGoal={handleCreateGoal}
      />
    </div>
  );
};

export default Goals;