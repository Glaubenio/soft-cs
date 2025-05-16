import { Journey } from "@/types/types";
import { createContext } from "react";

interface JourneyContextType {
  journeys: Journey[];
  children: React.ReactNode;
}

export const JourneysContext = createContext<{ journeys: Journey[] }>({
  journeys: []
});

export const JourneysProvider = ({ children, journeys }: JourneyContextType) => {
  return (
    <JourneysContext.Provider value={{ journeys }}>
      {children}
    </JourneysContext.Provider>
  );
}
