import { CheckCircle2, Circle, Target, Calendar, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Goal } from '@/services/goalService';

interface GoalCardProps {
  goal: Goal;
  onComplete: (goalId: string) => void;
  onDelete: (goalId: string) => void;
}

const GoalCard = ({ goal, onComplete, onDelete }: GoalCardProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const isOverdue = new Date() > goal.deadline && !goal.completed;

  return (
    <Card className={`glass-card border-none ${goal.completed ? 'opacity-75' : ''} w-full max-w-sm mx-auto transition-all duration-300 hover:shadow-lg`}>
      <CardHeader className="flex flex-col sm:flex-row items-start justify-between space-y-2 sm:space-y-0 p-4">
        <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto">
          <Button
            variant="ghost"
            size="icon"
            className={`${goal.completed ? 'text-green-500' : 'text-gray-400'} flex-shrink-0`}
            onClick={() => onComplete(goal.id)}
          >
            {goal.completed ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </Button>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base sm:text-lg truncate">{goal.title}</h3>
            <p className="text-sm text-gray-400 capitalize">{goal.type} goal</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-red-500 flex-shrink-0"
          onClick={() => onDelete(goal.id)}
        >
          <span className="sr-only">Delete goal</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-gray-300 line-clamp-2">{goal.description}</p>
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className={`${isOverdue ? 'text-red-400' : 'text-gray-400'} whitespace-nowrap`}>
              Due {formatDate(goal.deadline)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-400">{goal.streak} day streak</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${goal.completed ? 'bg-green-500' : 'bg-sypher-accent'}`}
            style={{ width: `${goal.completed ? '100' : (goal.completionHistory?.length || 0) * (goal.type === 'daily' ? 14.28 : 25)}%` }}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default GoalCard;