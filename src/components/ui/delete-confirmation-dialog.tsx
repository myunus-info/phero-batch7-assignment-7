"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const modalTitle =
    title || `Delete ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`;

  const modalDescription =
    description ||
    (itemName ? (
      <>
        Are you sure you want to delete{" "}
        <strong className="text-foreground font-semibold">
          &ldquo;{itemName}&rdquo;
        </strong>
        ? This action cannot be undone.
      </>
    ) : (
      `Are you sure you want to delete this ${itemType}? This action cannot be undone.`
    ));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="flex items-center space-x-3 mb-1">
          <div className="p-2 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle className="text-foreground text-lg">
            {modalTitle}
          </DialogTitle>
        </div>
        <DialogDescription className="text-muted-foreground text-sm pl-11">
          {modalDescription}
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="gap-2 sm:gap-0 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={onConfirm}
          isLoading={isLoading}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          <span>{confirmText}</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export { DeleteConfirmationModal as DeleteConfirmationDialog };
export default DeleteConfirmationModal;
