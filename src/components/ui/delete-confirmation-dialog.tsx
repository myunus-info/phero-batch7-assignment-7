"use client";

import * as React from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";

export interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: React.ReactNode;
  itemName?: string;
  itemType?: string;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  itemName,
  itemType = "item",
  onConfirm,
  isLoading = false,
  confirmText = "Delete",
  cancelText = "Cancel",
}: DeleteConfirmationModalProps) {
  const modalTitle = title || `Delete ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`;

  const modalDescription =
    description ||
    (itemName ? (
      <>
        Are you sure you want to delete <strong className="text-white font-semibold">&ldquo;{itemName}&rdquo;</strong>?
        This action cannot be undone.
      </>
    ) : (
      `Are you sure you want to delete this ${itemType}? This action cannot be undone.`
    ));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="flex items-center space-x-3 mb-1">
          <div className="p-2 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle className="text-white text-lg">{modalTitle}</DialogTitle>
        </div>
        <DialogDescription className="text-slate-400 text-sm pl-11">{modalDescription}</DialogDescription>
      </DialogHeader>

      <DialogFooter className="gap-2 sm:gap-0 mt-6">
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button type="button" variant="destructive" onClick={onConfirm} isLoading={isLoading} className="gap-2">
          <Trash2 className="h-4 w-4" />
          <span>{confirmText}</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export { DeleteConfirmationModal as DeleteConfirmationDialog };
export default DeleteConfirmationModal;
