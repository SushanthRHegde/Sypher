import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface Project {
  name: string;
  description: string;
  techStack: string[];
  githubUrl: string;
}

interface ProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
}

const ProjectDialog = ({ isOpen, onClose, onSave }: ProjectDialogProps) => {
  const [newProject, setNewProject] = useState<Project>({
    name: '',
    description: '',
    techStack: [],
    githubUrl: ''
  });
  const [newTechStack, setNewTechStack] = useState('');

  const handleAddTechStack = () => {
    if (newTechStack && !newProject.techStack.includes(newTechStack)) {
      setNewProject(prev => ({
        ...prev,
        techStack: [...prev.techStack, newTechStack]
      }));
      setNewTechStack('');
    }
  };

  const handleRemoveTechStack = (tech: string) => {
    setNewProject(prev => ({
      ...prev,
      techStack: prev.techStack.filter(t => t !== tech)
    }));
  };

  const handleSave = () => {
    if (newProject.name && newProject.description && newProject.techStack.length > 0 && newProject.githubUrl) {
      onSave(newProject);
      setNewProject({
        name: '',
        description: '',
        techStack: [],
        githubUrl: ''
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              placeholder="Project name"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Input
              placeholder="Project description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex gap-2">
              <Input
                placeholder="Add technology (e.g., React, Node.js)"
                value={newTechStack}
                onChange={(e) => setNewTechStack(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTechStack()}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAddTechStack}
                disabled={!newTechStack}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newProject.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-sypher-accent/10 text-sypher-accent rounded-full text-xs flex items-center gap-1"
                >
                  {tech}
                  <button
                    onClick={() => handleRemoveTechStack(tech)}
                    className="p-0.5 rounded-full hover:bg-destructive/20 transition-colors"
                  >
                    <X className="h-3 w-3 text-destructive" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Input
              placeholder="GitHub URL"
              value={newProject.githubUrl}
              onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSave}
            disabled={!newProject.name || !newProject.description || newProject.techStack.length === 0 || !newProject.githubUrl}
          >
            Add Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;