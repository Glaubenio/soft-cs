'use client';
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ClientsList } from "./ClientsList";
import ClientsKanban from "./ClientsKanban";
import { ClientsToolbar } from "./ClientsToolbar";
import { Client, Journey, User } from "@/types/types";
import { JourneysProvider } from "../journeys-context";
import { useRouter } from "next/navigation";
import { CientsProvider } from "../clients-context";

interface Props {
  activeUsers: User[],
}
const ClientsView = ({ activeUsers }: Props) => {
  const [activeTab, setActiveTab] = React.useState('list');
  const router = useRouter();
  return (
    <>
      <JourneysProvider>
        <CientsProvider
          activeUsers={activeUsers}
        >
          <Tabs defaultValue={activeTab}>
            <TabsList className="flex md:flex-row flex-col-reverse justify-between md:items-center gap-1 md:gap-0 items-start w-full">
              <div >
                <TabsTrigger
                  onClick={() => setActiveTab("list")} value="list">
                  Lista
                </TabsTrigger>
                <TabsTrigger onClick={() => setActiveTab("kanban")} value="kanban">
                  Kanban
                </TabsTrigger>
              </div>
              <ClientsToolbar activeTab={activeTab} />
            </TabsList>
            <TabsContent value="list">
              <ClientsList />
            </TabsContent>
            <TabsContent value="kanban">
              <ClientsKanban />
            </TabsContent>
          </Tabs>
        </CientsProvider>
      </JourneysProvider>
    </>
  );
};

export default ClientsView;
