'use client';
import { Client, Journey, User } from "@/types/types";
import { createContext, useContext, useEffect, useState } from "react";
import { JourneysContext } from "./journeys-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import useDebounce from "@/hooks/useDebounce";

interface ClientContextType {
  clients: Client[];
  setQueryParams: (queryParams: Record<string, string | string[] | undefined>) => void;
  setCurrentClients: (clients: Client[]) => void;
  activeUsers: User[];
  queryParams: Record<string, string | string[] | undefined>;
  selectedJourney?: Journey;
  deleteClient: (client: Client, onFinish: () => void) => void;
  deleting: boolean;
  handleSelectedFilter: (name: 'status' | 'serviceType' | 'responsibleId', value: string) => void;
  submitFilters: () => void;
  changeName: (name: string) => void;
  currentFilters: {
    status: string[]
    serviceType: string[]
    responsibleId: string[]
    name: string
  }
}

export const ClientsContext = createContext<ClientContextType>({
  clients: [],
  setQueryParams: () => { },
  queryParams: {},
  activeUsers: [],
  setCurrentClients: () => { },
  deleteClient: () => { },
  deleting: false,
  handleSelectedFilter: () => { },
  submitFilters: () => { },
  changeName: () => { },
  currentFilters: {
    status: [],
    serviceType: [],
    responsibleId: [],
    name: ''
  },
});

export const CientsProvider = ({
  children,
  clients,
  activeUsers,
  currentQueryParams,
  filters }: {
    clients: Client[],
    activeUsers: User[],
    children: React.ReactNode,
    currentQueryParams: Record<string, string | string[] | undefined>;
    filters: {
      status: string[]
      serviceType: string[]
      responsibleId: string[]
      name: string
    }
  }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { journeys } = useContext(JourneysContext);
  const [currentClients, setCurrentClients] = useState<Client[]>(clients);
  // Por convenção, null vai ser utilizada para indicar vizualação agrupada por status
  // Qualquer outro valor será um id de jornada
  const [queryParams, setQueryParams] = useState<Record<string, string | string[] | undefined>>(currentQueryParams);
  const [deleting, setDeleting] = useState(false);
  const [currentFilters, setFilters] = useState<{
    status: string[]
    serviceType: string[]
    responsibleId: string[]
    name: string
  }>(filters)

  const changeName = (name: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      name: name,
    }));

  }

  const handleSelectedFilter = (name: 'status' | 'serviceType' | 'responsibleId', value: string) => {
    if (currentFilters[name]?.includes(value)) {
      setFilters({
        ...currentFilters,
        [name]: currentFilters[name].filter((s) => s !== value),
      })
    } else {
      setFilters({
        ...currentFilters,
        [name]: [...currentFilters[name], value],
      })
    }
  }

  const submitFilters = () => {
    router.push(`/clients?status=${currentFilters.status.join(',')}` +
      `&serviceType=${currentFilters.serviceType.join(',')}` +
      `&name=${currentFilters.name}` +
      `&responsibleId=${currentFilters.responsibleId.join(',')}`)
  }

  useEffect(() => {
    submitFilters();
  }, [currentFilters.name])

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
      activeUsers,
      handleSelectedFilter,
      submitFilters,
      currentFilters: currentFilters,
      changeName
    }}>
      {children}
    </ClientsContext.Provider>
  );
}
