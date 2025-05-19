
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuLabel,
  DropdownMenuTrigger, DropdownMenuSeparator,
  DropdownMenuGroup, DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { ReactNode, useContext } from "react";
import { JourneysContext } from "../../journeys-context";
import { ClientsContext } from "../../clients-context";

export const VizualizationModeDropdownMenu = ({ triggerButton }: { triggerButton: ReactNode }) => {
  const { journeys } = useContext(JourneysContext);
  const { setQueryParams } = useContext(ClientsContext);
  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      {triggerButton}
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel>Tipo de vizualação</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem onClick={() => setQueryParams({
          journeyId: undefined
        })}>
          Status
        </DropdownMenuItem>
        {
          journeys.map((journey) => (
            <DropdownMenuItem onClick={() => setQueryParams({
              journeyId: journey.id
            })} key={journey.id}>
              Jornada: {journey.name}
            </DropdownMenuItem>
          ))
        }
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
}