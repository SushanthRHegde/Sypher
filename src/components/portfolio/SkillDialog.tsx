import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SkillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (skill: { name: string; level: string }) => void;
}

const SkillDialog = ({ isOpen, onClose, onSave }: SkillDialogProps) => {
  const [newSkill, setNewSkill] = useState({ name: '', level: '' });

  const handleSave = () => {
    if (newSkill.name && newSkill.level) {
      onSave(newSkill);
      setNewSkill({ name: '', level: '' });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Skill</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              placeholder="Skill name (e.g., JavaScript, Python)"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Select
              value={newSkill.level}
              onValueChange={(value) => setNewSkill({ ...newSkill, level: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select skill level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!newSkill.name || !newSkill.level}>Add Skill</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SkillDialog;