"use client";

import { useEffect, useState } from "react";

import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

import { Icons } from "../ui/icons";
import { CheckCircle, Trash, XCircle } from "lucide-react";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: AlertModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      icon={<Trash className="text-primary" />}
      hidesCloseButton={true}
      className="!w-auto !rounded-[12px] max-w-[400px]"
      title="Tem certeza que deseja excluir?"
      description={"Esta ação não poderá ser desfeita.\nO item será removido permanentemente."}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-center w-full ">
        <Button disabled={loading} onClick={onClose}>
          Cancelar
          <XCircle />
        </Button>
        <Button disabled={loading} className="border-destructive text-destructive" variant={"outline"} onClick={onConfirm}>
          Excluir
          {loading ? <Icons.spinner className="animate-spin" /> : <CheckCircle className="text-destructive" />}
        </Button>
      </div>
    </Modal>
  );
};

export default AlertModal;
