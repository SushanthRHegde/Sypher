
import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Plus, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Sample notes data
const sampleNotes = [
  {
    id: "1",
    title: "Dynamic Programming Patterns",
    excerpt: "Common patterns in dynamic programming problems and how to identify them.",
    tags: ["algorithms", "dp", "leetcode"],
    date: "2024-04-10",
  },
  {
    id: "2",
    title: "System Design: Distributed Cache",
    excerpt: "Notes on designing a distributed caching system with Redis.",
    tags: ["system-design", "cache", "redis"],
    date: "2024-04-08",
  },
  {
    id: "3",
    title: "JavaScript Promise Patterns",
    excerpt: "Advanced patterns for handling asynchronous operations with Promises.",
    tags: ["javascript", "async", "promises"],
    date: "2024-04-05",
  },
  {
    id: "4",
    title: "Binary Tree Traversal Techniques",
    excerpt: "Different ways to traverse binary trees: in-order, pre-order, post-order, and level-order.",
    tags: ["data-structures", "trees", "algorithms"],
    date: "2024-04-01",
  },
  {
    id: "5",
    title: "React Performance Optimization",
    excerpt: "Techniques for improving React app performance including memoization, virtualization, and code splitting.",
    tags: ["react", "performance", "frontend"],
    date: "2024-03-28",
  },
];

// All unique tags from notes
const allTags = Array.from(
  new Set(sampleNotes.flatMap(note => note.tags))
).sort();

const Notes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Filter notes based on search term and selected tags
  const filteredNotes = sampleNotes.filter(note => {
    const matchesSearch = 
      searchTerm === "" || 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      note.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      
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
        {filteredNotes.map((note) => (
          <Link to={`/notes/${note.id}`} key={note.id}>
            <div className="glass-card p-6 h-full hover:border-sypher-accent/50 transition-colors">
              <div className="flex items-center gap-2 mb-3 text-sypher-accent">
                <BookOpen size={16} />
                <span className="text-xs text-gray-400">{note.date}</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{note.title}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">{note.excerpt}</p>
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
        ))}
      </div>
    </div>
  );
};

export default Notes;
