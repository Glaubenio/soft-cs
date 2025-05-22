import { useToast } from "@/components/ui/use-toast";
import { Client, Account, User } from "@/types/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

interface AccountsContextType {
  accounts: Account[];
  deleteAccount: (account: Account, onFinish: () => void) => void;
  deleting: boolean;
  setCurrentAccounts: (accounts: Account[]) => void;

}
export const AccountsContext = createContext<AccountsContextType>({
  accounts: [],
  deleteAccount: () => { },
  deleting: false,
  setCurrentAccounts: () => { },
})

export const AccountsProvider = ({ children, accounts }: {
  children: React.ReactNode,
  accounts: Account[],
}) => {
  const [currentAccounts, setCurrentAccounts] = useState<Account[]>(accounts);
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);

  const deleteAccount = async (task: Account, onFinish: () => void) => {
    setDeleting(true)
    try {
      await axios.delete(`/api/accounts/${task.id}`)
      onFinish();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Error deleting account";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
    setDeleting(false)
  }

  useEffect(() => {
    setCurrentAccounts(accounts);
  }, [accounts])
  return (
    <AccountsContext.Provider value={{
      accounts: currentAccounts,
      deleteAccount,
      deleting,
      setCurrentAccounts: setCurrentAccounts,
    } as AccountsContextType
    }>
      {children}
    </AccountsContext.Provider>
  )
}