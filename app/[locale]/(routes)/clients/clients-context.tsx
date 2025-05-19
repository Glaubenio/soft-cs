import { Client, Journey, User } from "@/types/types";
import { createContext, useContext, useEffect, useState } from "react";
import { JourneysContext } from "./journeys-context";
import { useRouter } from "next/navigation";

interface ClientContextType {
  clients: Client[];
  setQueryParams: (queryParams: Record<string, string | string[] | undefined>) => void;
  setCurrentClients: (clients: Client[]) => void;
  activeUsers: User[];
  queryParams: Record<string, string | string[] | undefined>;
  selectedJourney?: Journey;
}

export const ClientsContext = createContext<ClientContextType>({
  clients: [],
  setQueryParams: () => { },
  queryParams: {},
  activeUsers: [],
  setCurrentClients: () => { },
  selectedJourney: null,
});

export const CientsProvider = ({ children, clients, activeUsers, currentQueryParams }: {
  clients: Client[],
  activeUsers: User[],
  children: React.ReactNode,
  currentQueryParams: Record<string, string | string[] | undefined>;
}) => {
  const router = useRouter();
  const { journeys } = useContext(JourneysContext);
  const [currentClients, setCurrentClients] = useState<Client[]>(clients);
  // Por convenção, null vai ser utilizada para indicar vizualação agrupada por status
  // Qualquer outro valor será um id de jornada
  const [queryParams, setQueryParams] = useState<Record<string, string | string[] | undefined>>(currentQueryParams);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(window.location.search).toString();
    router.push(`/clients?${newSearchParams}`);

  }, [queryParams]);

  const updateQueryParams = (newQueryParams: Record<string, string | string[] | undefined>) => {
    setQueryParams((prevQueryParams) => ({
      ...prevQueryParams,
      ...newQueryParams,
    }));
  }

  const selectedJourney = journeys.find((journey) => journey.id === queryParams.journeyId) || undefined;
  console.log("Selected journey: ", selectedJourney);
  return (
    <ClientsContext.Provider value={{
      clients: currentClients,
      setCurrentClients,
      selectedJourney,
      setQueryParams: updateQueryParams,
      queryParams,
      activeUsers
    }}>
      {children}
    </ClientsContext.Provider>
  );
}
