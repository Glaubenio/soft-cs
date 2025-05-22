import { useToast } from "@/components/ui/use-toast";
import { Client, User, User } from "@/types/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

interface UsersContextType {
  users: User[];
  deleteUser: (user: User, onFinish: () => void) => void;
  deleting: boolean;
  setCurrentUsers: (users: User[]) => void;

}
export const UsersContext = createContext<UsersContextType>({
  users: [],
  deleteUser: () => { },
  deleting: false,
  setCurrentUsers: () => { },
})

export const UsersProvider = ({ children, users }: {
  children: React.ReactNode,
  users: User[],
}) => {
  const [currentUsers, setCurrentUsers] = useState<User[]>(users);
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);

  const deleteUser = async (task: User, onFinish: () => void) => {
    setDeleting(true)
    try {
      await axios.delete(`/api/users/${task.id}`)
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

  useEffect(() => {
    setCurrentUsers(users);
  }, [users])
  return (
    <UsersContext.Provider value={{
      users: currentUsers,
      deleteUser,
      deleting,
      setCurrentUsers: setCurrentUsers,
    } as UsersContextType
    }>
      {children}
    </UsersContext.Provider>
  )
}