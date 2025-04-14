
import { useState, useEffect } from "react";
import { BookOpen, Plus, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Note, noteService } from "@/services/noteService";
import CreateNoteModal from "@/components/notes/CreateNoteModal";
import NoteCard from "@/components/notes/NoteCard";

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user]);

  const loadNotes = async () => {
    try {
      const userNotes = await noteService.getUserNotes(user!.uid);
      setNotes(userNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const handleCreateNote = async (noteData: { title: string; content: string; tags: string[] }) => {
    try {
      await noteService.createNote({
        ...noteData,
        userId: user!.uid,
      });
      loadNotes();
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  // All unique tags from notes
  const allTags = Array.from(
    new Set(notes.flatMap(note => note.tags))
  ).sort();

  // Filter notes based on search term and selected tags
  const filteredNotes = notes.filter(note => {
    const matchesSearch = 
      searchTerm === "" || 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesTags = 
      selectedTags.length === 0 || 
      selectedTags.some(tag => note.tags.includes(tag));
      
    return matchesSearch && matchesTags;
  });
  
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notes</h1>
          <p className="text-gray-400">
            Organize your study materials and code snippets.
          </p>
        </div>
        
        <Button
          className="bg-sypher-accent hover:bg-sypher-accent/90"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={18} className="mr-2" />
          New Note
        </Button>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-sypher-gray border-none"
          />
        </div>
      </div>
      
      {/* Tags */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Tag size={16} className="text-sypher-accent" />
          <h2 className="font-medium">Tags</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTags.includes(tag)
                  ? "bg-sypher-accent text-white"
                  : "bg-sypher-gray text-gray-300 hover:bg-sypher-gray/80"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      
      {/* Notes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <NoteCard 
            key={note.id} 
            note={note} 
            onDelete={loadNotes}
          />
        ))}
      </div>

      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateNote={handleCreateNote}
      />
    </div>
  );
};

export default Notes;
