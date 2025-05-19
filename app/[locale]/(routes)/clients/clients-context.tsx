import { Client, User } from "@/types/types";
import { createContext, useState } from "react";

interface ClientContextType {
  clients: Client[];
  setVisualizationMode: (mode: string | null) => void;
  vizualizationMode: string | null;
  activeUsers: User[];
}

export const ClientsContext = createContext<ClientContextType>({
  clients: [],
  setVisualizationMode: () => { },
  vizualizationMode: null,
  activeUsers: []
});

export const CientsProvider = ({ children, clients, activeUsers }: {
  clients: Client[],
  activeUsers: User[],
  children: React.ReactNode
}) => {
  // Por convenção, null vai ser utilizada para indicar vizualação agrupada por status
  // Qualquer outro valor será um id de jornada
  const [vizualizationMode, setVisualizationMode] = useState<string | null>(null);
  return (
    <ClientsContext.Provider value={{ clients, setVisualizationMode, vizualizationMode, activeUsers }}>
      {children}
    </ClientsContext.Provider>
  );
}
