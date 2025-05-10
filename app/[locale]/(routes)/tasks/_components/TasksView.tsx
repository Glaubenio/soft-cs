import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TasksLists } from "./TasksLists";
import TasksKanban from "./TasksKanban";
import { TasksToolbar } from "./TasksToolbar";


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
            <TasksToolbar />
          </TabsList>
          <TabsContent value="list">
            <TasksLists />
          </TabsContent>
          <TabsContent value="kanban">
            <TasksKanban />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default TasksView;
