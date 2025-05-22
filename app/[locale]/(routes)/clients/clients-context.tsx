'use client';
import { Client, Journey, User } from "@/types/types";
import { createContext, useContext, useState } from "react";
import { JourneysContext } from "./journeys-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import useSWR from "swr";
import { defaultFetcher } from "@/lib/utils";

interface Filters {
  status: string[]
  serviceType: string[]
  responsibleId: string[]
  name: string
}
interface ClientContextType {
  clients?: Client[];
  activeUsers: User[];
  selectedJourney?: Journey;
  setSelectedJourney: (journey?: Journey) => void;
  deleteClient: (client: Client, onFinish: () => void) => void;
  deleting: boolean;
  handleSelectedFilter: (name: 'status' | 'serviceType' | 'responsibleId', value: string) => void;
  changeName: (name: string) => void;
  currentFilters: Filters
  isLoading: boolean;
  refresh: (clients?: Client[], options?: any) => void;
}

export const ClientsContext = createContext<ClientContextType>({
  clients: [],
  activeUsers: [],
  selectedJourney: undefined,
  deleteClient: () => { },
  deleting: false,
  handleSelectedFilter: () => { },
  changeName: () => { },
  currentFilters: {
    status: [],
    serviceType: [],
    responsibleId: [],
    name: ''
  },
  isLoading: false,
  refresh: () => { },
  setSelectedJourney: () => { }
});

export const CientsProvider = ({
  children,
  activeUsers }: {
    activeUsers: User[],
    children: React.ReactNode,
  }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { journeys } = useContext(JourneysContext);
  // Por convenção, null vai ser utilizada para indicar vizualação agrupada por status
  // Qualquer outro valor será um id de jornada
  const [currentFilters, setFilters] = useState<{
    status: string[]
    serviceType: string[]
    responsibleId: string[]
    name: string
  }>({
    status: [],
    serviceType: [],
    responsibleId: [],
    name: ''
  })

  const { data: clients, isLoading, mutate } = useSWR<Client[]>(['/api/clients', currentFilters],
    ([url, queryFilters]) => defaultFetcher(url, {
      status: (queryFilters as Filters).status.join(','), // Não achei jeito melhor de fazer o parsing disso
      serviceType: (queryFilters as Filters).serviceType.join(','),
      responsibleId: (queryFilters as Filters).responsibleId.join(','),
      name: (queryFilters as Filters).name
    }))

  const [deleting, setDeleting] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState<Journey | undefined>(undefined);
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

  const deleteClient = async (client: Client, onFinish: () => void) => {
    setDeleting(true);
    try {
      await axios.delete(`/api/clients/${client.id}`);
      mutate();
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

  return (
    <ClientsContext.Provider value={{
      deleteClient,
      deleting,
      clients,
      selectedJourney,
      setSelectedJourney,
      isLoading,
      activeUsers,
      handleSelectedFilter,
      refresh: mutate,
      currentFilters: currentFilters,
      changeName
    }}>
      {children}
    </ClientsContext.Provider>
  );
}
