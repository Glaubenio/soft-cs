'use client';
import React from "react";
import { Account, Client, Task, User } from "@/types/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AccountsToolbar } from "./AcccountsToolbar";
import { AccountsProvider } from "../accounts-context";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

interface Props {
  accounts: Account[]
}

const AccountsView = ({ accounts }: Props) => {
  return (
    <AccountsProvider
      accounts={accounts}
    >
      <div className="space-y-3">
        <AccountsToolbar />
      </div>
      <Table className="bg-white rounded-[20px]">
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account, index) => (
            <TableRow>
              <TableCell className="text-sm font-medium text-gray-900">
                {account.name}
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
    </AccountsProvider>
  );
};

export default AccountsView;
