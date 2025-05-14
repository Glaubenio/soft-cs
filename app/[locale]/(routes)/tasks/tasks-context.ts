import { Task, User } from "@/types/types";
import { createContext } from "react";

export const TasksContext = createContext<{ tasks: Task[], activeUsers: User[] }>({
  tasks: [],
  activeUsers: [],
})