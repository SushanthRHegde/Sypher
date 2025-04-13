import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { createNote, uploadAttachment } from '@/services/noteService';
import { Loader2, X, Plus, Image } from 'lucide-react';

interface Attachment {
  file: File;
  previewUrl?: string;
}

const NewNote = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const handleTagAdd = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAttachmentAdd = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        newAttachments.push({ file, previewUrl });
      } else {
        newAttachments.push({ file });
      }
    }

    setAttachments([...attachments, ...newAttachments]);
  };

  const handleAttachmentRemove = (index: number) => {
    const newAttachments = [...attachments];
    if (newAttachments[index].previewUrl) {
      URL.revokeObjectURL(newAttachments[index].previewUrl!);
    }
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to create notes',
        variant: 'destructive',
      });
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast({
        title: 'Required fields missing',
        description: 'Please fill in both title and content',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Upload attachments first
      const uploadedAttachments = await Promise.all(
        attachments.map(async ({ file }) => {
          return await uploadAttachment(file, user.uid);
        })
      );

      // Create note with uploaded attachments
      const noteId = await createNote(user.uid, {
        title: title.trim(),
        content: content.trim(),
        excerpt: content.trim().slice(0, 150) + (content.length > 150 ? '...' : ''),
        tags,
        userId: user.uid,
        attachments: uploadedAttachments,
      });

      toast({
        title: 'Success',
        description: 'Note created successfully',
      });

      navigate(`/notes/${noteId}`);
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: 'Error creating note',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Create New Note</h1>
          <p className="text-gray-400">Capture your thoughts and knowledge</p>
        </div>

        <div className="space-y-4">
          <Input
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold bg-sypher-gray border-none"
          />

          <Textarea
            placeholder="Write your note content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[300px] bg-sypher-gray border-none"
          />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Add tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                className="bg-sypher-gray border-none"
              />
              <Button
                type="button"
                onClick={handleTagAdd}
                variant="outline"
                size="icon"
                className="shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-sm bg-sypher-accent text-white flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="hover:text-white/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="gap-2"
              >
                <Image className="h-4 w-4" />
                Add Attachments
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleAttachmentAdd}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {attachments.map((attachment, index) => (
                <div key={index} className="relative group">
                  {attachment.previewUrl ? (
                    <img
                      src={attachment.previewUrl}
                      alt={attachment.file.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-32 bg-sypher-gray rounded-lg flex items-center justify-center">
                      <span className="text-sm text-gray-400">{attachment.file.name}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleAttachmentRemove(index)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/notes')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-sypher-accent hover:bg-sypher-accent/90" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Note'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewNote;