import { useToast } from "@/components/ui/use-toast";
import { Task, User } from "@/types/types";
import axios from "axios";
import { createContext, useState } from "react";

interface TasksContextType {
  tasks: Task[];
  activeUsers: User[];
  deleteTask: (task: Task, onFinish: () => void) => void;
  deleting: boolean;
}
export const TasksContext = createContext<TasksContextType>({
  tasks: [],
  activeUsers: [],
  deleteTask: () => { },
  deleting: false
})

export const TasksProvider = ({ children, tasks, activeUsers }: {
  children: React.ReactNode,
  tasks: Task[],
  activeUsers: User[]
}) => {
  const [currentTasks, setCurrentTasks] = useState<Task[]>(tasks);
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);

  const deleteTask = async (task: Task, onFinish: () => void) => {
    setDeleting(true)
    try {
      const response = await axios.delete(`/api/tasks/${task.id}`)
      console.log("Task deleted", response.data);
      setCurrentTasks((prev) => prev.filter((t) => t.id !== task.id));
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
  return (
    <TasksContext.Provider value={{ tasks: currentTasks, activeUsers, deleteTask, deleting }
    }>
      {children}
    </TasksContext.Provider>
  )
}