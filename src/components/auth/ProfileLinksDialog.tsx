
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Github, Code, ExternalLink, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchGitHubProfile, fetchLeetCodeProfile } from '@/services/profileService';

interface ProfileLinksDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (links: ProfileLinks) => void;
  initialLinks?: ProfileLinks;
}

export interface ProfileLinks {
  github: string;
  leetcode: string;
  hackerrank: string;
}

const ProfileLinksDialog = ({ isOpen, onClose, onSave, initialLinks }: ProfileLinksDialogProps) => {
  const [links, setLinks] = useState<ProfileLinks>(initialLinks || {
    github: '',
    leetcode: '',
    hackerrank: ''
  });
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const handleChange = (platform: keyof ProfileLinks, value: string) => {
    setLinks(prev => ({ ...prev, [platform]: value }));
  };

  const handleSave = async () => {
    setIsValidating(true);
    try {
      let hasValidationError = false;

      // Validate GitHub username
      if (links.github) {
        const githubProfile = await fetchGitHubProfile(links.github);
        if (!githubProfile) {
          toast({
            title: "Invalid GitHub username",
            description: "Please check your GitHub username and try again",
            variant: "destructive",
          });
          hasValidationError = true;
        }
      }

      // Validate LeetCode username
      if (links.leetcode) {
        const leetcodeProfile = await fetchLeetCodeProfile(links.leetcode);
        if (!leetcodeProfile) {
          toast({
            title: "Invalid LeetCode username",
            description: "Please check your LeetCode username and try again",
            variant: "destructive",
          });
          hasValidationError = true;
        }
      }

      if (hasValidationError) {
        setIsValidating(false);
        return;
      }

      // Save the links if all validations pass
      await onSave(links);
      toast({
        title: "Profile links saved",
        description: "Your coding platform links have been successfully saved",
      });
      onClose();
    } catch (error) {
      console.error('Profile save error:', error);
      toast({
        title: "Error saving profile links",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
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
            <div className="flex-1 relative">
              <Input
                placeholder="GitHub username"
                value={links.github}
                onChange={(e) => handleChange('github', e.target.value)}
                className="w-full"
              />
              {links.github && (
                <Button
                  variant="ghost"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-6"
                  onClick={() => window.open(`https://github.com/${links.github}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Code className="h-5 w-5 text-gray-400" />
            <div className="flex-1 relative">
              <Input
                placeholder="LeetCode username"
                value={links.leetcode}
                onChange={(e) => handleChange('leetcode', e.target.value)}
                className="w-full"
              />
              {links.leetcode && (
                <Button
                  variant="ghost"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-6"
                  onClick={() => window.open(`https://leetcode.com/${links.leetcode}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          {/* <div className="flex items-center gap-4">
            <ExternalLink className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="HackerRank username"
              value={links.hackerrank}
              onChange={(e) => handleChange('hackerrank', e.target.value)}
              className="flex-1"
            />
          </div> */}
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose} disabled={isValidating}>Skip for now</Button>
          <Button 
            onClick={handleSave} 
            className="bg-sypher-accent hover:bg-sypher-accent/90"
            disabled={isValidating}
          >
            {isValidating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validating
              </>
            ) : (
              'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileLinksDialog;
