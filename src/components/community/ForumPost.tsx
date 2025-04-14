import { MessageSquare, ThumbsUp, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ForumPostProps {
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  createdAt: Date;
  likes: number;
  comments: number;
  views: number;
}

const ForumPost = ({
  title,
  content,
  author,
  category,
  createdAt,
  likes,
  comments,
  views,
}: ForumPostProps) => {
  return (
    <div className="glass-card p-6 hover:border-sypher-accent/50 transition-colors cursor-pointer">
      <div className="flex items-start gap-4">
        <img
          src={author.avatar}
          alt={author.name}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1 hover:text-sypher-accent transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
            <span>{author.name}</span>
            <span>•</span>
            <span>{formatDistanceToNow(createdAt)} ago</span>
            <span>•</span>
            <span className="text-sypher-accent">{category}</span>
          </div>
          <p className="text-gray-300 line-clamp-2 mb-4">{content}</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-400">
              <ThumbsUp size={16} />
              <span>{likes}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <MessageSquare size={16} />
              <span>{comments}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Eye size={16} />
              <span>{views}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPost;