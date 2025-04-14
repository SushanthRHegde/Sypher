import { MessageSquare, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Chat from '@/components/community/Chat';

const Community = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community</h1>
        <p className="text-gray-400">
          Connect with fellow developers, share knowledge, and grow together.
        </p>
      </div>

      {/* Community Chat */}
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare size={20} className="text-sypher-accent" />
        <h2 className="text-xl font-semibold">Community Chat</h2>
        <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-sypher-gray/30 rounded-full">
          <Users size={16} className="text-gray-400" />
          <span className="text-sm text-gray-400">Online</span>
        </div>
      </div>

      <Chat />
    </div>
  );
};

export default Community;