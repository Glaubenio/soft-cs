'use client';
import React, { useContext, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AccountsToolbar } from "./AcccountsToolbar";
import { AccountsContext, AccountsProvider } from "../accounts-context";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import LoadingComponent from "@/components/LoadingComponent";
import { Account } from "@/types/types";
import { AccountForm } from "../forms/Account";
import AlertModal from "@/components/modals/alert-modal";

const AccountsTable = () => {
  const { accounts, isLoading, deleting, deleteAccount } = useContext(AccountsContext);
  const [editingModalInfo, setEditingModalInfo] = useState<{ open: boolean; account?: Account }>({
    open: false,
    account: undefined,
  });
  const [deleteModalInfo, setDeleteModalInfo] = useState<{ open: boolean; account?: Account }>({ open: false, account: undefined });
  if (isLoading) {
    return <div className="flex flex-col items-center justify-center w-full h-full">
      <LoadingComponent />
    </div>
  }
  return <>
    <AlertModal
      isOpen={deleteModalInfo.open}
      onClose={() => setDeleteModalInfo(prev => ({ ...prev, open: false }))}
      onConfirm={() => deleteAccount(deleteModalInfo.account!, () => setDeleteModalInfo({ open: false, account: undefined }))}
      loading={deleting}
    />
    {editingModalInfo.open &&
      <AccountForm
        open={editingModalInfo.open}
        account={editingModalInfo.account}
        setOpen={(open) => setEditingModalInfo((prev) => ({ ...prev, open: open }))} />
    }
    <Table className="bg-white rounded-[20px]">
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>CNPJ</TableHead>
          <TableHead>Segmento</TableHead>
          <TableHead>Tamanho</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {accounts?.map((account, index) => (
          <TableRow key={index}>
            <TableCell className="text-sm font-medium text-gray-900">
              {account.name}
            </TableCell>
            <TableCell className="text-sm font-medium text-gray-900">
              {account.cnpj}
            </TableCell>
            <TableCell className="text-sm font-medium text-gray-900">
              {account.segment}
            </TableCell>
            <TableCell className="text-sm font-medium text-gray-900">
              {account.size}
            </TableCell>
            <TableCell className="space-x-2 flex flex-row items-center">
              <Button onClick={() => setEditingModalInfo({ open: true, account })}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button onClick={() => setDeleteModalInfo({ open: true, account })}>
                <Trash className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </>
}

const AccountsView = () => {
  return (
    <AccountsProvider
    >
      <div className="space-y-3">
        <AccountsToolbar />
      </div>
      <AccountsTable />

    </AccountsProvider>
  );
};

export default AccountsView;
