import { Users, Calendar, BookOpen, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StudyGroupProps {
  name: string;
  description: string;
  category: string;
  members: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  maxMembers: number;
  meetingSchedule?: string;
  topics: string[];
  isJoined?: boolean;
  onJoin?: () => void;
}

const StudyGroup = ({
  name,
  description,
  category,
  members,
  maxMembers,
  meetingSchedule,
  topics,
  isJoined = false,
  onJoin,
}: StudyGroupProps) => {
  return (
    <div className="glass-card p-6 hover:border-sypher-accent/50 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">{name}</h3>
          <p className="text-sypher-accent text-sm">{category}</p>
        </div>
        <Button
          variant={isJoined ? 'outline' : 'default'}
          className={isJoined ? '' : 'bg-sypher-accent hover:bg-sypher-accent/90'}
          onClick={onJoin}
        >
          {isJoined ? 'Joined' : 'Join Group'}
        </Button>
      </div>

      <p className="text-gray-300 mb-4">{description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {topics.map((topic, index) => (
          <span
            key={index}
            className="px-3 py-1 rounded-full bg-sypher-gray text-sm text-gray-300"
          >
            {topic}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
        <div className="flex items-center gap-2">
          <Users size={16} />
          <span>{members.length}/{maxMembers} members</span>
        </div>
        {meetingSchedule && (
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{meetingSchedule}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {members.slice(0, 3).map((member) => (
            <img
              key={member.id}
              src={member.avatar}
              alt={member.name}
              className="w-8 h-8 rounded-full border-2 border-sypher-gray"
              title={member.name}
            />
          ))}
          {members.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-sypher-gray flex items-center justify-center text-sm">
              +{members.length - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyGroup;