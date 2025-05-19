
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuLabel,
  DropdownMenuTrigger, DropdownMenuSeparator,
  DropdownMenuGroup, DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { ReactNode, useContext } from "react";
import { JourneysContext } from "../../journeys-context";

export const VizualizationModeDropdownMenu = ({ triggerButton }: { triggerButton: ReactNode }) => {
  const { journeys } = useContext(JourneysContext);
  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      {triggerButton}
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel>Tipo de vizualação</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          Status
        </DropdownMenuItem>
        {
          journeys.map((journey) => (
            <DropdownMenuItem key={journey.id}>
              Jornada: {journey.name}
            </DropdownMenuItem>
          ))
        }
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
}