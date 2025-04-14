import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowLeft, BookOpen, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Note, noteService } from '@/services/noteService';

const ViewNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadNote = async () => {
      try {
        if (!id) return;
        const noteData = await noteService.getNote(id);
        setNote(noteData);
      } catch (error) {
        console.error('Error loading note:', error);
        toast({
          title: 'Error',
          description: 'Failed to load the note. Please try again.',
          variant: 'destructive',
        });
        navigate('/notes');
      } finally {
        setIsLoading(false);
      }
    };

    loadNote();
  }, [id, navigate, toast]);

  const handleDelete = async () => {
    if (!note) return;
    setIsDeleting(true);
    try {
      await noteService.deleteNote(note.id);
      toast({
        title: 'Note deleted',
        description: 'Your note has been successfully deleted.',
      });
      navigate('/notes');
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

  if (isLoading) {
    return (
      <div className="p-4 md:px-16 md:py-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-sypher-gray rounded mb-4"></div>
          <div className="h-4 w-32 bg-sypher-gray rounded mb-8"></div>
          <div className="h-64 bg-sypher-gray rounded"></div>
        </div>
      </div>
    );
  }

  if (!note) {
    return null;
  }

  return (
    <div className="p-4 md:px-16 md:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/notes')}
              className="text-gray-400 hover:text-sypher-accent"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{note.title}</h1>
              <div className="flex items-center gap-2 text-gray-400 mt-1">
                <BookOpen size={16} />
                <span className="text-sm">
                  {new Date(note.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-gray-400 hover:text-red-500"
            disabled={isDeleting}
          >
            <Trash2 size={20} />
          </Button>
        </div>

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-sypher-gray/50 rounded-full text-sm text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="glass-card p-6 prose prose-invert max-w-none">
          <ReactMarkdown
            components={{
              code: ({ node, inline, className, children, ...props }: {
                node: any;
                inline?: boolean;
                className?: string;
                children: React.ReactNode;
              }) => {
                const match = /language-(\w+)/.exec(className || '');
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
    </div>
  );
};

export default ViewNote;