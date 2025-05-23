import { useToast } from "@/components/ui/use-toast";
import { defaultFetcher } from "@/lib/utils";
import { Client, Account, User } from "@/types/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import useSWR from "swr";

interface AccountsContextType {
  accounts: Account[];
  deleteAccount: (account: Account, onFinish: () => void) => void;
  deleting: boolean;
  isLoading: boolean;
  refresh: () => void;
}
export const AccountsContext = createContext<AccountsContextType>({
  accounts: [],
  deleteAccount: () => { },
  deleting: false,
  isLoading: false,
  refresh: () => { },
})

export const AccountsProvider = ({ children }: {
  children: React.ReactNode,
}) => {
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);
  const { data: accounts, isLoading, mutate } = useSWR<Account[]>('/api/crm/account', (url: string) => defaultFetcher(url))

  const deleteAccount = async (task: Account, onFinish: () => void) => {
    setDeleting(true)
    try {
      await axios.delete(`/api/account/${task.id}`)
      mutate();
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

  return (
    <AccountsContext.Provider value={{
      accounts,
      deleteAccount,
      deleting,
      isLoading,
      refresh: mutate
    } as AccountsContextType
    }>
      {children}
    </AccountsContext.Provider>
  )
}