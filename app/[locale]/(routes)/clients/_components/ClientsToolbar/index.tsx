'use client'
import { SearchInput } from "@/components/ui/search-input"
import { Button } from "@/components/ui/button"
import { ChevronDownCircle, PlusCircle, Sliders, Waypoints } from "lucide-react"
import { ReactNode, useState } from "react"
import { FilterDropdownMenu } from "./FilterDropdownMenu"
import { ClientForm } from "../../forms/Client"
import { JourneysDialog } from "../../forms/Journey"
import { VizualizationModeDropdownMenu } from "./VizualizationModeDropdownMenu"

interface Props {
  activeTab: string;
}

export const ClientsToolbar = ({ activeTab }: Props) => {
  const [clientFormOpen, setClientFormOpen] = useState(false);
  const [journeysDialogOpen, setJourneysDialogOpen] = useState(false);

  return <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
    <ClientForm open={clientFormOpen} setOpen={setClientFormOpen} />
    <JourneysDialog open={journeysDialogOpen} setOpen={setJourneysDialogOpen} />
    {
      activeTab === 'kanban' && <div className="hidden md:flex flex-row gap-1">
        <VizualizationModeDropdownMenu triggerButton={
          <Button className="text-primary border-primary" variant="outline">
            Tipo de vizualização:
            <div className="font-bold">Status</div>
            <ChevronDownCircle />
          </Button>
        } />

      </div>
    }
    <SearchInput placeholder="Filtrar por nome do cliente..." className="md:w-80 w-full" />
    <div className="flex flex-row gap-1 justify-between items-center">
      <FilterDropdownMenu triggerButton={(
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
  </div>
}