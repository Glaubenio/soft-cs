import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ClientsList } from "./ClientsList";
import ClientsKanban from "./ClientsKanban";
import { ClientsToolbar } from "./ClientsToolbar";


const ClientsView = async () => {
  return (
    <>

      <Tabs defaultValue="list">
        <TabsList className="flex md:flex-row flex-col-reverse justify-between md:items-center gap-1 md:gap-0 items-start w-full">
          <div >
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
          </div>
          <ClientsToolbar />
        </TabsList>
        <TabsContent value="list">
          <ClientsList />
        </TabsContent>
        <TabsContent value="kanban">
          <ClientsKanban />
        </TabsContent>
      </Tabs>

    </>
  );
};

export default ClientsView;
