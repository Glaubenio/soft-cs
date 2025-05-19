
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuLabel,
  DropdownMenuTrigger, DropdownMenuSeparator,
  DropdownMenuGroup, DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { ReactNode } from "react";

export const FilterDropdownMenu = ({ triggerButton }: { triggerButton: ReactNode }) => <DropdownMenu>
  <DropdownMenuTrigger asChild>
    {triggerButton}
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuLabel>Tipo de atendimento</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuItem>
        High
      </DropdownMenuItem>
      <DropdownMenuItem>
        Low
      </DropdownMenuItem>
      <DropdownMenuItem>
        Tech
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuLabel>CSM Responsável</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuItem>
        Jon Snow
      </DropdownMenuItem>
      <DropdownMenuItem>
        Cersei Lannister
      </DropdownMenuItem>
      <DropdownMenuItem>
        Tyrion Lannister
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuLabel>Status</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuItem>
        Ativo
      </DropdownMenuItem>
      <DropdownMenuItem>
        Inativo
      </DropdownMenuItem>
      <DropdownMenuItem>
        Em implantação
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
  </DropdownMenuContent>
</DropdownMenu>