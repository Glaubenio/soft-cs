import { Client, Journey, User } from "@/types/types";
import { createContext, useContext, useEffect, useState } from "react";
import { JourneysContext } from "./journeys-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

interface ClientContextType {
  clients: Client[];
  setQueryParams: (queryParams: Record<string, string | string[] | undefined>) => void;
  setCurrentClients: (clients: Client[]) => void;
  activeUsers: User[];
  queryParams: Record<string, string | string[] | undefined>;
  selectedJourney?: Journey;
  deleteClient: (client: Client, onFinish: () => void) => void;
  deleting: boolean;
}

export const ClientsContext = createContext<ClientContextType>({
  clients: [],
  setQueryParams: () => { },
  queryParams: {},
  activeUsers: [],
  setCurrentClients: () => { },
  deleteClient: () => { },
  deleting: false,
});

export const CientsProvider = ({ children, clients, activeUsers, currentQueryParams }: {
  clients: Client[],
  activeUsers: User[],
  children: React.ReactNode,
  currentQueryParams: Record<string, string | string[] | undefined>;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { journeys } = useContext(JourneysContext);
  const [currentClients, setCurrentClients] = useState<Client[]>(clients);
  // Por convenção, null vai ser utilizada para indicar vizualação agrupada por status
  // Qualquer outro valor será um id de jornada
  const [queryParams, setQueryParams] = useState<Record<string, string | string[] | undefined>>(currentQueryParams);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(window.location.search).toString();
    router.push(`/clients?${newSearchParams}`);

  }, [queryParams]);

  useEffect(() => {
    setCurrentClients(clients);
  }, [clients])

  const updateQueryParams = (newQueryParams: Record<string, string | string[] | undefined>) => {
    setQueryParams((prevQueryParams) => ({
      ...prevQueryParams,
      ...newQueryParams,
    }));
  }

  const deleteClient = async (client: Client, onFinish: () => void) => {
    setDeleting(true);
    try {
      await axios.delete(`/api/clients/${client.id}`);
      setCurrentClients((prevClients) => prevClients.filter((c) => c.id !== client.id));
    } catch (error) {
      console.error("Error deleting client: ", error);
      toast({
        title: "Erro ao deletar cliente",
        description: "Ocorreu um erro ao deletar o cliente. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
    setDeleting(false);
    onFinish();
  }

  const selectedJourney = journeys.find((journey) => journey.id === queryParams.journeyId) || undefined;
  return (
    <ClientsContext.Provider value={{
      deleteClient,
      deleting,
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
