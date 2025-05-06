import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ClientsTable } from "./TasksTable";
import ClientsKanban from "./TasksKanban";
import { ClientsToolbar } from "./TasksToolbar";


const TasksView = async () => {
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
      </div>
    </>
  );
};

export default TasksView;
