import { useToast } from "@/components/ui/use-toast";
import { Client, Task, User } from "@/types/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

interface TasksContextType {
  tasks: Task[];
  activeUsers: User[];
  deleteTask: (task: Task, onFinish: () => void) => void;
  deleting: boolean;
  setCurrentTasks: (tasks: Task[]) => void;
  clients: Client[]
  submitFilters: () => void;
  handleSelectedFilter: (name: 'status' | 'priority' | 'responsibleId', value: string) => void;
  currentFilters: {
    status: string[]
    priority: string[]
    responsibleId: string[]
  }
}
export const TasksContext = createContext<TasksContextType>({
  tasks: [],
  activeUsers: [],
  deleteTask: () => { },
  deleting: false,
  setCurrentTasks: () => { },
  clients: [],
  submitFilters: () => { },
  handleSelectedFilter: () => { },
  currentFilters: {
    status: [],
    priority: [],
    responsibleId: [],
  }
})

export const TasksProvider = ({ children, tasks, activeUsers, clients, filters }: {
  children: React.ReactNode,
  tasks: Task[],
  activeUsers: User[]
  clients: Client[],
  filters: {
    status: string[]
    priority: string[]
    responsibleId: string[]
  }
}) => {
  const router = useRouter();
  const [currentTasks, setCurrentTasks] = useState<Task[]>(tasks);
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);


  const [currentFilters, setFilters] = useState<{
    status: string[]
    priority: string[]
    responsibleId: string[]
  }>(filters)

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

  const submitFilters = () => {
    router.push(`/tasks?status=${currentFilters.status.join(',')}` +
      `&priority=${currentFilters.priority.join(',')}` +
      `&responsibleId=${currentFilters.responsibleId.join(',')}`)
  }


  const deleteTask = async (task: Task, onFinish: () => void) => {
    setDeleting(true)
    try {
      await axios.delete(`/api/tasks/${task.id}`)
      onFinish();
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

  useEffect(() => {
    setCurrentTasks(tasks);
  }, [tasks])
  return (
    <TasksContext.Provider value={{
      clients,
      tasks: currentTasks,
      activeUsers,
      deleteTask,
      deleting,
      setCurrentTasks: setCurrentTasks,
      submitFilters,
      handleSelectedFilter,
      currentFilters,
    } as TasksContextType
    }>
      {children}
    </TasksContext.Provider>
  )
}