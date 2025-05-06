'use client'
import { SearchInput } from "@/components/ui/search-input"
import { ClientForm } from "../forms/Client"
import { JourneysDialog } from "../forms/Journey"
import { Button } from "@/components/ui/button"
import { PlusCircle, Sliders, Waypoints } from "lucide-react"
import { ReactNode, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const FilterDropDownMenu = ({ triggerButton }: { triggerButton: ReactNode }) => <DropdownMenu>
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

export const ClientsToolbar = () => {
  const [clientFormOpen, setClientFormOpen] = useState(false);
  const [journeysDialogOpen, setJourneysDialogOpen] = useState(false);

  return <div className="flex flex-row gap-2">
    <ClientForm open={clientFormOpen} setOpen={setClientFormOpen} />
    <JourneysDialog open={journeysDialogOpen} setOpen={setJourneysDialogOpen} />
    <SearchInput placeholder="Filtrar por nome do cliente..." className="w-80" />
    <FilterDropDownMenu triggerButton={(
      <Button>
        <Sliders /> Filtrar
      </Button>)
    } />

    <Button onClick={() => setJourneysDialogOpen(true)}>
      <Waypoints /> Jornada
    </Button>
    <Button onClick={() => setClientFormOpen(true)}>
      <PlusCircle /> Novo Cliente
    </Button>
  </div>
}