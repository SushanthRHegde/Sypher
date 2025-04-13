import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface BioDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bio: string) => Promise<void>;
  initialBio?: string;
}

const MAX_BIO_LENGTH = 250;

const BioDialog = ({ isOpen, onClose, onSave, initialBio }: BioDialogProps) => {
  const [bioText, setBioText] = useState(initialBio || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setBioText(initialBio || '');
  }, [initialBio]);

  const handleSave = async () => {
    if (bioText.trim() && bioText.length <= MAX_BIO_LENGTH) {
      setIsLoading(true);
      try {
        await onSave(bioText.trim());
        onClose();
      } catch (error) {
        console.error('Error saving bio:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const characterCount = bioText.length;
  const isOverLimit = characterCount > MAX_BIO_LENGTH;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Bio</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Textarea
              placeholder="Tell us about yourself..."
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              className={`min-h-[120px] resize-none transition-colors ${isOverLimit ? 'border-destructive' : ''}`}
              maxLength={MAX_BIO_LENGTH}
            />
            <div className="flex justify-end">
              <span 
                className={`text-sm ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}
              >
                {characterCount}/{MAX_BIO_LENGTH}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!bioText.trim() || isOverLimit || isLoading}
            className="bg-sypher-accent hover:bg-sypher-accent/90"
          >
            {isLoading ? 'Saving...' : 'Save Bio'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BioDialog;