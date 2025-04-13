import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Certificate {
  name: string;
  organization: string;
  issueDate: string;
  verificationUrl: string;
}

interface CertificateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (certificate: Certificate) => void;
}

const CertificateDialog = ({ isOpen, onClose, onSave }: CertificateDialogProps) => {
  const [newCertificate, setNewCertificate] = useState<Certificate>({
    name: '',
    organization: '',
    issueDate: '',
    verificationUrl: ''
  });

  const handleSave = () => {
    if (newCertificate.name && newCertificate.organization && newCertificate.issueDate && newCertificate.verificationUrl) {
      onSave(newCertificate);
      setNewCertificate({
        name: '',
        organization: '',
        issueDate: '',
        verificationUrl: ''
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Certificate</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              placeholder="Certificate name"
              value={newCertificate.name}
              onChange={(e) => setNewCertificate({ ...newCertificate, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Input
              placeholder="Organization/Company"
              value={newCertificate.organization}
              onChange={(e) => setNewCertificate({ ...newCertificate, organization: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Input
              type="date"
              value={newCertificate.issueDate}
              onChange={(e) => setNewCertificate({ ...newCertificate, issueDate: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Input
              placeholder="Verification URL"
              value={newCertificate.verificationUrl}
              onChange={(e) => setNewCertificate({ ...newCertificate, verificationUrl: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSave}
            disabled={!newCertificate.name || !newCertificate.organization || !newCertificate.issueDate || !newCertificate.verificationUrl}
          >
            Add Certificate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateDialog;