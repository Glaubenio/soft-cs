import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Sliders, Waypoints } from "lucide-react";
import { ClientsTable } from "./ClientsTable";
import ClientsKanban from "./ClientsKanban";
import { SearchInput } from "@/components/ui/search-input";
import { ClientForm } from "../forms/Client";
import { ClientsToolbar } from "./ClientsToolbar";


const ClientsView = async () => {
  return (
    <>
      <div className="space-y-3">
        <Tabs defaultValue="list">
          <TabsList className="flex flex-row justify-between items-center w-full">
            <div>
              <TabsTrigger value="list">Lista</TabsTrigger>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
            </div>
            <ClientsToolbar />
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
