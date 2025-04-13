
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Github, Code, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileLinksDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (links: ProfileLinks) => void;
}

export interface ProfileLinks {
  github: string;
  leetcode: string;
  hackerrank: string;
}

const ProfileLinksDialog = ({ isOpen, onClose, onSave }: ProfileLinksDialogProps) => {
  const [links, setLinks] = useState<ProfileLinks>({
    github: '',
    leetcode: '',
    hackerrank: ''
  });
  const { toast } = useToast();

  const handleChange = (platform: keyof ProfileLinks, value: string) => {
    setLinks(prev => ({ ...prev, [platform]: value }));
  };

  const handleSave = () => {
    onSave(links);
    toast({
      title: "Profile links saved",
      description: "Your coding platform links have been successfully saved",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add your coding profiles</DialogTitle>
          <DialogDescription>
            Connect your coding platform profiles to track your progress and showcase your skills.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Github className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="GitHub username"
              value={links.github}
              onChange={(e) => handleChange('github', e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="flex items-center gap-4">
            <Code className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="LeetCode username"
              value={links.leetcode}
              onChange={(e) => handleChange('leetcode', e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="flex items-center gap-4">
            <ExternalLink className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="HackerRank username"
              value={links.hackerrank}
              onChange={(e) => handleChange('hackerrank', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>Skip for now</Button>
          <Button onClick={handleSave} className="bg-sypher-accent hover:bg-sypher-accent/90">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileLinksDialog;
