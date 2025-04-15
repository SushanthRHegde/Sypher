import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AvatarOption {
  id: number;
  src: string;
  alt: string;
}

const avatarOptions: AvatarOption[] = [
  { id: 1, src: '/src/assets/profile1.jpg', alt: 'Profile Avatar 1' },
  { id: 2, src: '/src/assets/profile2.jpg', alt: 'Profile Avatar 2' },
  { id: 3, src: '/src/assets/profile3.jpg', alt: 'Profile Avatar 3' },
  { id: 4, src: '/src/assets/profile4.png', alt: 'Profile Avatar 4' },
  { id: 5, src: '/src/assets/profile5.jpg', alt: 'Profile Avatar 5' },
  { id: 6, src: '/src/assets/profile6.png', alt: 'Profile Avatar 6' },
];

interface AvatarDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (avatarUrl: string) => void;
  currentAvatar?: string;
}

const AvatarDialog = ({ isOpen, onClose, onSave, currentAvatar }: AvatarDialogProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(currentAvatar);
  const { toast } = useToast();

  const handleSave = () => {
    if (selectedAvatar) {
      onSave(selectedAvatar);
      toast({
        title: 'Avatar updated',
        description: 'Your profile picture has been updated successfully',
      });
      onClose();
    } else {
      toast({
        title: 'Selection required',
        description: 'Please select an avatar before saving',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose your avatar</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 py-4">
          {avatarOptions.map((avatar) => (
            <div
              key={avatar.id}
              className={`relative cursor-pointer rounded-lg overflow-hidden ${selectedAvatar === avatar.src ? 'ring-2 ring-sypher-accent' : ''}`}
              onClick={() => setSelectedAvatar(avatar.src)}
            >
              <img
                src={avatar.src}
                alt={avatar.alt}
                className="w-full h-full object-cover aspect-square"
              />
            </div>
          ))}
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSave}
            className="bg-sypher-accent hover:bg-sypher-accent/90"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarDialog;