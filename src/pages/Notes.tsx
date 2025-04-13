import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Plus, Search, Tag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Note, fetchUserNotes } from "@/services/noteService";
import { useToast } from "@/hooks/use-toast";

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const loadNotes = async () => {
      if (!user) {
        setNotes([]);
        setLoading(false);
        return;
      }

      try {
        const userNotes = await fetchUserNotes(user.uid);
        setNotes(userNotes);
      } catch (error) {
        console.error("Error loading notes:", error);
        toast({
          title: "Error loading notes",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [user, toast]);

  // All unique tags from notes
  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags))).sort();

  // Filter notes based on search term and selected tags
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      searchTerm === "" ||
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.excerpt && note.excerpt.toLowerCase().includes(searchTerm.toLowerCase())); // Ensure `note.excerpt` exists

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => note.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter((t) => t !== tag)
        : [...prevSelectedTags, tag]
    );
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

        <Button asChild className="bg-sypher-accent hover:bg-sypher-accent/90">
          <Link to="/notes/new" className="flex items-center gap-2">
            <Plus size={18} />
            New Note
          </Link>
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
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-sypher-accent" />
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            <p>No notes found. Create your first note!</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <Link to={`/notes/${note.id}`} key={note.id}>
              <div className="glass-card p-6 h-full hover:border-sypher-accent/50 transition-colors">
                <div className="flex items-center gap-2 mb-3 text-sypher-accent">
                  <BookOpen size={16} />
                  {/* <span className="text-xs text-gray-400">{note}</span> */}
                </div>
                <h3 className="font-semibold text-lg mb-2">{note.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {note.excerpt}
                </p>
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
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Notes;