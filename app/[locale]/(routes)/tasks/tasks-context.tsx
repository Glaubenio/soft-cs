import { useToast } from "@/components/ui/use-toast";
import { defaultFetcher } from "@/lib/utils";
import { Client, Task, User } from "@/types/types";
import axios from "axios";
import { createContext, useState } from "react";
import useSWR from "swr";

interface TasksContextType {
  tasks: Task[];
  activeUsers: User[];
  deleteTask: (task: Task, onFinish: () => void) => void;
  deleting: boolean;
  clients: Client[]
  isLoading: boolean;
  handleSelectedFilter: (name: 'status' | 'priority' | 'responsibleId', value: string) => void;
  refresh: (tasks?: Task[], options?: any) => void;
  currentFilters: {
    status: string[]
    priority: string[]
    responsibleId: string[]
  }
}

interface Filters {
  status: string[]
  priority: string[]
  responsibleId: string[]
  clientId: string
}

export const TasksContext = createContext<TasksContextType>({
  tasks: [],
  activeUsers: [],
  deleteTask: () => { },
  deleting: false,
  clients: [],
  refresh: () => { },
  handleSelectedFilter: () => { },
  currentFilters: {
    status: [],
    priority: [],
    responsibleId: [],
  },
  isLoading: false
})

export const TasksProvider = ({ children, activeUsers, clients, clientId }: {
  children: React.ReactNode,
  activeUsers: User[]
  clients: Client[],
  clientId?: string
}) => {
  const [currentFilters, setFilters] = useState<Filters>({
    status: [],
    priority: [],
    responsibleId: [],
    clientId: clientId || ''
  })
  const { data: tasks, isLoading, mutate } = useSWR<Task[]>(['/api/tasks', currentFilters],
    ([url, queryFilters]) => defaultFetcher(url, {
      status: (queryFilters as Filters).status.join(','), // Não achei jeito melhor de fazer o parsing disso
      priority: (queryFilters as Filters).priority.join(','),
      responsibleId: (queryFilters as Filters).responsibleId.join(','),
      clientId: (queryFilters as Filters).clientId
    }))
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);


  const handleSelectedFilter = (name: 'status' | 'priority' | 'responsibleId', value: string) => {
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

  const deleteTask = async (task: Task, onFinish: () => void) => {
    setDeleting(true)
    try {
      await axios.delete(`/api/tasks/${task.id}`)
      onFinish();
      mutate();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Error deleting task";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
    setDeleting(false)
  }

  return (
    <TasksContext.Provider value={{
      clients,
      isLoading,
      tasks,
      activeUsers,
      deleteTask,
      deleting,
      handleSelectedFilter,
      currentFilters,
      refresh: mutate
    } as TasksContextType
    }>
      {children}
    </TasksContext.Provider>
  )
}