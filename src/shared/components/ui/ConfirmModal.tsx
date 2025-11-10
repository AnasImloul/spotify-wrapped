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
  cancelText = 'Cancel'
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-950/90 border-green-500/30 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500/20 border border-green-500/30">
              <AlertTriangle className="w-5 h-5 text-green-400" />
            </div>
            <DialogTitle className="text-xl font-bold text-white">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-white/70">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 border-white/20 text-white hover:bg-white/10"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-lg shadow-green-500/20"
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

