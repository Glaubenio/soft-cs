import { defaultFetcher } from "@/lib/utils";
import { Journey } from "@/types/types";
import { createContext } from "react";
import useSWR from "swr";

interface JourneyContextType {
  journeys?: Journey[];
  isLoading: boolean;
  refresh: () => void;
}

export const JourneysContext = createContext<JourneyContextType>({
  journeys: [],
  isLoading: false,
  refresh: () => { }
});

export const JourneysProvider = ({ children }: { children: React.ReactNode; }) => {
  const { data: journeys, isLoading, mutate } = useSWR<Journey[]>('/api/journeys', (url: string) => defaultFetcher(url))
  return (
    <JourneysContext.Provider value={{ journeys, isLoading, refresh: mutate }}>
      {children}
    </JourneysContext.Provider>
  );
}
