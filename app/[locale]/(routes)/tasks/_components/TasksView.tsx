'use client';
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TasksLists } from "./TasksLists";
import TasksKanban from "./TasksKanban";
import { TasksToolbar } from "./TasksToolbar";
import { Task, User } from "@/types/types";
import { TasksContext } from "../tasks-context";

interface Props {
  tasks: Task[]
  activeUsers: User[]
}

const TasksView = ({ tasks, activeUsers }: Props) => {

  return (
    <TasksContext.Provider value={{
      tasks,
      activeUsers,
    }} >
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
    </TasksContext.Provider>
  );
};

export default TasksView;
