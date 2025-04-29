import React from "react";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { TableBody } from "@tremor/react";
import { Button } from "@/components/ui/button";
import { Edit, EllipsisVertical } from "lucide-react";
import { ClientsTable } from "./ClientsTable";
import ClientsKanban from "./ClientsKanban";


const ClientsView = async () => {

  return (
    <>
      <div className="space-y-3">
        <Tabs defaultValue="list">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <ClientsTable />
          </TabsContent>
          <TabsContent value="kanban">
            <ClientsKanban />
          </TabsContent>
        </Tabs>
      </div >


    </>
  );
};

export default ClientsView;
