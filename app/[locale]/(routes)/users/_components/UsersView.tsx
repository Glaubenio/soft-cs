'use client';
import React, { useContext, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UsersToolbar } from "./UsersToolbar";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { UsersContext, UsersProvider } from "../users-context";
import LoadingComponent from "@/components/LoadingComponent";
import { Account, User } from "@/types/types";
import AlertModal from "@/components/modals/alert-modal";
import { UserForm } from "../forms/User";

interface Props {
  accounts: Account[]
}


const UsersTable = () => {
  const { users, isLoading, deleting, deleteUser } = useContext(UsersContext);
  const [editingModalInfo, setEditingModalInfo] = useState<{ open: boolean; user?: User }>({
    open: false,
    user: undefined,
  });
  const [deleteModalInfo, setDeleteModalInfo] = useState<{ open: boolean; user?: User }>({ open: false, user: undefined });
  if (isLoading) {
    return <div className="flex flex-col items-center justify-center w-full h-full">
      <LoadingComponent />
    </div>
  }
  return <>
    <AlertModal
      isOpen={deleteModalInfo.open}
      onClose={() => setDeleteModalInfo(prev => ({ ...prev, open: false }))}
      onConfirm={() => deleteUser(deleteModalInfo.user!, () => setDeleteModalInfo({ open: false, user: undefined }))}
      loading={deleting}
    />
    {editingModalInfo.open &&
      <UserForm
        open={editingModalInfo.open}
        user={editingModalInfo.user}
        setOpen={(open) => setEditingModalInfo((prev) => ({ ...prev, open: open }))} />
    }
    <Table className="bg-white rounded-[20px]">
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>Cargo</TableHead>
          <TableHead>Conta</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users?.map((user, index) => (
          <TableRow key={index}>
            <TableCell className="text-sm font-medium text-gray-900">
              {user.name}
            </TableCell>
            <TableCell className="text-sm font-medium text-gray-900">
              {user.email}
            </TableCell>
            <TableCell className="text-sm font-medium text-gray-900">
              {user.jobTitle}
            </TableCell>
            <TableCell className="text-sm font-medium text-gray-900">
              {user.account?.name}
            </TableCell>
            <TableCell className="space-x-2 flex flex-row items-center">
              <Button onClick={() => setEditingModalInfo({ open: true, user })}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button onClick={() => setDeleteModalInfo({ open: true, user })}>
                <Trash className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </>;
}
const UsersView = ({ accounts }: Props) => {
  return (
    <UsersProvider accounts={accounts} >
      <div className="space-y-3">
        <UsersToolbar />
      </div>

      <UsersTable />
    </UsersProvider >
  );
};

export default UsersView;
