import { useToast } from "@/components/ui/use-toast";
import { Client, Task, User } from "@/types/types";
import axios from "axios";
import { createContext, useEffect, useState } from "react";

interface TasksContextType {
  tasks: Task[];
  activeUsers: User[];
  deleteTask: (task: Task, onFinish: () => void) => void;
  deleting: boolean;
  setCurrentTasks: (tasks: Task[]) => void;
  clients: Client[]
}
export const TasksContext = createContext<TasksContextType>({
  tasks: [],
  activeUsers: [],
  deleteTask: () => { },
  deleting: false,
  setCurrentTasks: () => { },
  clients: []
})

export const TasksProvider = ({ children, tasks, activeUsers, clients }: {
  children: React.ReactNode,
  tasks: Task[],
  activeUsers: User[]
  clients: Client[]
}) => {
  const [currentTasks, setCurrentTasks] = useState<Task[]>(tasks);
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);

  const deleteTask = async (task: Task, onFinish: () => void) => {
    setDeleting(true)
    try {
      const response = await axios.delete(`/api/tasks/${task.id}`)
      console.log("Task deleted", response.data);
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
      setCurrentTasks: setCurrentTasks
    } as TasksContextType
    }>
      {children}
    </TasksContext.Provider>
  )
}