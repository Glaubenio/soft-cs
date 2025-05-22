'use client';
import React from "react";
import { User } from "@/types/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UsersToolbar } from "./UsersToolbar";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { UsersProvider } from "../users-context";

interface Props {
  users: User[]
}

const UsersView = ({ users }: Props) => {
  return (
    <UsersProvider
      users={users}
    >
      <div className="space-y-3">
        <UsersToolbar />
      </div>
      <Table className="bg-white rounded-[20px]">
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow>
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
    </UsersProvider>
  );
};

export default UsersView;
