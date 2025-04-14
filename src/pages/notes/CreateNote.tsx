import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { noteService } from '@/services/noteService';

const CreateNote = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [errors, setErrors] = useState({ title: false, content: false });

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    const newErrors = {
      title: !title.trim(),
      content: !content.trim(),
    };
    setErrors(newErrors);

    if (!newErrors.title && !newErrors.content) {
      try {
        await noteService.createNote({
          title: title.trim(),
          content: content.trim(),
          tags,
          userId: user!.uid,
        });
        toast({
          title: 'Success',
          description: 'Note created successfully',
        });
        navigate('/notes');
      } catch (error) {
        console.error('Error creating note:', error);
        toast({
          title: 'Error',
          description: 'Failed to create note. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20 px-4 md:px-16 pb-8 max-w-5xl mx-auto">
        <div className="space-y-6 md:space-y-8">
          <div className="space-y-2">
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`text-2xl md:text-3xl font-semibold bg-transparent border-0 px-4 py-3 md:px-0 md:py-0 h-auto focus-visible:ring-0 ${errors.title ? 'placeholder:text-red-500' : ''}`}
              placeholder="Untitled"
            />
            {errors.title && (
              <p className="text-sm text-red-500">Please add a title</p>
            )}
          </div>

          <div className="space-y-2">
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`min-h-[calc(100vh-300px)] text-base md:text-lg leading-relaxed bg-transparent border-0 focus-visible:ring-0 resize-none px-4 py-3 md:p-0 ${errors.content ? 'placeholder:text-red-500' : ''}`}
              placeholder="Start writing..."
            />
            {errors.content && (
              <p className="text-sm text-red-500">Please add some content</p>
            )}
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t py-4">
            <div className="max-w-5xl mx-auto px-4 md:px-16 flex flex-col md:flex-row md:items-center gap-4 justify-between">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-sypher-accent" />
                  <Label htmlFor="tags" className="text-sm font-medium">Tags</Label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-sypher-gray/20 hover:bg-sypher-gray/30 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 transition-colors group"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-400 group-hover:text-red-500 transition-colors"
                        aria-label={`Remove ${tag} tag`}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center gap-2 min-w-[200px]">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Type a tag and press Enter"
                      className="bg-sypher-gray/10 hover:bg-sypher-gray/20 focus:bg-sypher-gray/20 border-0 rounded-full px-4 py-2 md:px-3 md:py-1.5 h-auto focus-visible:ring-1 focus-visible:ring-sypher-accent text-sm transition-colors"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center md:justify-end gap-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/notes')}
                  className="hover:bg-sypher-gray/20"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-sypher-accent hover:bg-sypher-accent/90"
                  onClick={handleSubmit}
                >
                  Save Note
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNote;