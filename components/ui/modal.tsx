"use client";

import { DialogTitle } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "./dialog";

interface ModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  hidesCloseButton?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export default function Modal({
  title,
  description,
  isOpen,
  onClose,
  children,
  hidesCloseButton = false,
  className,
  icon = null,
}: ModalProps) {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className={className} hidesCloseButton={hidesCloseButton}>
        <DialogHeader className="flex items-center justify-center flex-col">
          {icon && <div className="flex size-[66px] bg-light-purple justify-center items-center rounded-full">
            {icon}
          </div>
          }
          <DialogTitle className="font-bold text-[18px] mt-[16px]">{title}</DialogTitle>
          <DialogDescription className="text-[12px] text-center">{description}</DialogDescription>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
