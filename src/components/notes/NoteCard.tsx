import { BookOpen, Eye, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Note, noteService } from '@/services/noteService';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

interface NoteCardProps {
  note: Note;
  onDelete?: () => void;
}

const NoteCard = ({ note, onDelete }: NoteCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await noteService.deleteNote(note.id);
      toast({
        title: 'Note deleted',
        description: 'Your note has been successfully deleted.',
      });
      onDelete?.();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the note. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };
  return (
    <div className="glass-card p-6 h-full hover:border-sypher-accent/50 transition-colors relative group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sypher-accent">
          <BookOpen size={16} />
          <span className="text-xs text-gray-400">
            {new Date(note.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-sypher-accent"
            onClick={() => navigate(`/notes/view/${note.id}`)}
          >
            <Eye size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isDeleting}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>



      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <h3 
        className="font-semibold text-lg mb-2 cursor-pointer hover:text-sypher-accent transition-colors"
        onClick={() => navigate(`/notes/${note.id}`)}
      >
        {note.title}
      </h3>
      <div className="text-gray-300 text-sm mb-4 prose prose-invert max-w-none line-clamp-3">
        <ReactMarkdown
          components={{
            code: ({ node, inline, className, children, ...props }: {
              node: any;
              inline?: boolean;
              className?: string;
              children: React.ReactNode;
            }) => {
              const match = /language-([\w-]+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {note.content}
        </ReactMarkdown>
      </div>
      <div className="flex flex-wrap gap-2">
        {note.tags.map((tag) => (
          <span 
            key={tag} 
            className="px-2 py-0.5 bg-sypher-gray/50 rounded-full text-xs text-gray-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default NoteCard;