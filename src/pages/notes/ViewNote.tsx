import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Tag, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Note, fetchNote } from '@/services/noteService';
import { useToast } from '@/hooks/use-toast';

const ViewNote = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNote = async () => {
      if (!id || !user) {
        navigate('/notes');
        return;
      }

      try {
        const noteData = await fetchNote(id);
        if (!noteData || noteData.userId !== user.uid) {
          toast({
            title: 'Note not found',
            description: 'The requested note does not exist or you do not have permission to view it',
            variant: 'destructive',
          });
          navigate('/notes');
          return;
        }
        setNote(noteData);
      } catch (error) {
        console.error('Error loading note:', error);
        toast({
          title: 'Error loading note',
          description: 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [id, user, navigate, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-sypher-accent" />
      </div>
    );
  }

  if (!note) {
    return null;
  }

  return (
    <div className="p-6 md:p-8">
      <Button
        variant="outline"
        onClick={() => navigate('/notes')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Notes
      </Button>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-3 text-sypher-accent">
          <BookOpen size={20} />
          <span className="text-sm text-gray-400">
            {new Date(note.createdAt.seconds * 1000).toLocaleDateString()}
          </span>
        </div>

        <h1 className="text-3xl font-bold mb-4">{note.title}</h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-sm bg-sypher-gray text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="prose prose-invert max-w-none">
          {note.content}
        </div>

        {note.attachments && note.attachments.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Attachments</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {note.attachments.map((attachment, index) => (
                <a
                  key={index}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {attachment.type.startsWith('image/') ? (
                    <img
                      src={attachment.url}
                      alt={attachment.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-32 bg-sypher-gray rounded-lg flex items-center justify-center">
                      <span className="text-sm text-gray-400">{attachment.name}</span>
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewNote;