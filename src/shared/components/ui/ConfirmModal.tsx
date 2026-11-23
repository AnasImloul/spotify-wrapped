/**
 * Confirm Modal Component
 * Reusable confirmation dialog for destructive actions
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <AlertTriangle className="w-5 h-5 text-code-orange" aria-hidden />
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            {cancelText}
          </Button>
          <Button onClick={handleConfirm} className="flex-1">
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
