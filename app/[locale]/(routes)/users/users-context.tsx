import { useToast } from "@/components/ui/use-toast";
import { User } from "@/types/types";
import axios from "axios";
import useSWR from 'swr'
import { createContext, useState } from "react";
import { defaultFetcher } from "@/lib/utils";

interface UsersContextType {
  users: User[];
  deleteUser: (user: User, onFinish: () => void) => void;
  deleting: boolean;
  isLoading: boolean;
  refresh: () => void;
}
export const UsersContext = createContext<UsersContextType>({
  users: [],
  deleteUser: () => { },
  deleting: false,
  isLoading: false,
  refresh: () => { }
})

export const UsersProvider = ({ children }: {
  children: React.ReactNode
}) => {
  const { data: users, isLoading, mutate } = useSWR<User[]>('/api/user', (url: string) => defaultFetcher(url))
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);

  const deleteUser = async (task: User, onFinish: () => void) => {
    setDeleting(true)
    try {
      await axios.delete(`/api/user/${task.id}`)
      mutate();
      onFinish();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Error deleting user";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
    setDeleting(false)
  }

  return (
    <UsersContext.Provider value={{
      isLoading,
      users,
      deleteUser,
      deleting,
      refresh: mutate
    } as UsersContextType
    }>
      {children}
    </UsersContext.Provider>
  )
}