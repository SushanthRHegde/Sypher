import { Code, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodeReviewProps {
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
  };
  language: string;
  status: 'pending' | 'in-review' | 'completed';
  createdAt: Date;
  codeSnippet: string;
  reviewers: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  commentCount: number;
  onReview?: () => void;
}

const CodeReview = ({
  title,
  description,
  author,
  language,
  status,
  createdAt,
  codeSnippet,
  reviewers,
  commentCount,
  onReview,
}: CodeReviewProps) => {
  const statusColors = {
    'pending': 'text-amber-500',
    'in-review': 'text-blue-500',
    'completed': 'text-green-500'
  };

  const statusIcons = {
    'pending': <Clock className="h-4 w-4" />,
    'in-review': <MessageSquare className="h-4 w-4" />,
    'completed': <CheckCircle className="h-4 w-4" />
  };

  return (
    <div className="glass-card p-6 hover:border-sypher-accent/50 transition-colors">
      <div className="flex items-start gap-4 mb-4">
        <img
          src={author.avatar}
          alt={author.name}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span>{author.name}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Code size={14} />
              {language}
            </span>
            <span>•</span>
            <span className={`flex items-center gap-1 ${statusColors[status]}`}>
              {statusIcons[status]}
              {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
            </span>
          </div>
        </div>
        <Button
          onClick={onReview}
          className="bg-sypher-accent hover:bg-sypher-accent/90"
        >
          Review
        </Button>
      </div>

      <p className="text-gray-300 mb-4">{description}</p>

      <div className="bg-sypher-gray rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm">
          <code>{codeSnippet}</code>
        </pre>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {reviewers.slice(0, 3).map((reviewer) => (
              <img
                key={reviewer.id}
                src={reviewer.avatar}
                alt={reviewer.name}
                className="w-8 h-8 rounded-full border-2 border-sypher-gray"
                title={reviewer.name}
              />
            ))}
            {reviewers.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-sypher-gray flex items-center justify-center text-sm">
                +{reviewers.length - 3}
              </div>
            )}
          </div>
          <span className="text-sm text-gray-400 ml-2">
            {reviewers.length} reviewer{reviewers.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-400">
          <MessageSquare size={16} />
          <span>{commentCount} comments</span>
        </div>
      </div>
    </div>
  );
};

export default CodeReview;