'use client';
import React, { useContext } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UsersToolbar } from "./UsersToolbar";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { UsersContext, UsersProvider } from "../users-context";
import LoadingComponent from "@/components/LoadingComponent";

interface Props {
}


const UsersTable = () => {
  const { users, isLoading } = useContext(UsersContext);
  if (isLoading) {
    return <div className="flex flex-col items-center justify-center w-full h-full">
      <LoadingComponent />
    </div>
  }
  return <Table className="bg-white rounded-[20px]">
    <TableHeader>
      <TableRow>
        <TableHead>Nome</TableHead>
        <TableHead></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {users?.map((user, index) => (
        <TableRow key={index}>
          <TableCell className="text-sm font-medium text-gray-900">
            {user.name}
          </TableCell>
          <TableCell className="space-x-2 flex flex-row items-center">
            <Button >
              <Edit className="w-4 h-4" />
            </Button>
            <Button >
              <Trash className="w-4 h-4" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
}
const UsersView = () => {
  return (
    <UsersProvider
    >
      <div className="space-y-3">
        <UsersToolbar />
      </div>
      <UsersTable />
    </UsersProvider>
  );
};

export default UsersView;
