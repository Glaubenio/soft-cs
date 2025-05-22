'use client';
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TasksLists } from "./TasksLists";
import TasksKanban from "./TasksKanban";
import { TasksToolbar } from "./TasksToolbar";
import { Client, Task, User } from "@/types/types";
import { TasksProvider } from "../tasks-context";
import { Kanban, List } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  activeUsers: User[]
  clients: Client[]
  clientId?: string
}

const TasksView = ({ clientId, activeUsers, clients }: Props) => {
  const router = useRouter();
  const tabTriggerClass = `data-[state=active]:bg-primary 
                          data-[state=active]:text-white  
                          data-[state=active]:border-b-2 
                          data-[state=active]:border-primary
                          data-[state=active]:md:border-b-primary 
                          data-[state=active]:md:bg-transparent  
                          data-[state=active]:md:text-foreground 
                          md:bg-transparent 
                          md:text-sm text-[12px] 
                          md:border-bottom 
                          md:border-0
                          border
                          bg-white 
                          border-primary`
  return (
    <TasksProvider
      clientId={clientId}
      clients={clients}
      activeUsers={activeUsers}
    >
      <div className="space-y-3">
        <Tabs defaultValue="list">
          <TabsList className="flex flex-row md:justify-between items-center w-full gap-1">
            <div className="flex items-center gap-2">
              <TabsTrigger
                className={tabTriggerClass}
                value="list">
                <List className="size-[12px] md:hidden" />Lista
              </TabsTrigger>
              <TabsTrigger
                className={tabTriggerClass}
                value="kanban">
                <Kanban className="size-[12px] md:hidden" /> Kanban
              </TabsTrigger>
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
    </TasksProvider>
  );
};

export default TasksView;
