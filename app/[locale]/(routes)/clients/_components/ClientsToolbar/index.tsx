'use client'
import { SearchInput } from "@/components/ui/search-input"
import { Button } from "@/components/ui/button"
import { ChevronDownCircle, PlusCircle, Sliders, Waypoints } from "lucide-react"
import { ReactNode, useContext, useEffect, useState } from "react"
import { FilterDropdownMenu } from "./FilterDropdownMenu"
import { ClientForm } from "../../forms/Client"
import { JourneysDialog } from "../../forms/Journey"
import { VizualizationModeDropdownMenu } from "./VizualizationModeDropdownMenu"
import { ClientsContext } from "../../clients-context"
import useDebounce from "@/hooks/useDebounce"

interface Props {
  activeTab: string;
}

export const ClientsToolbar = ({ activeTab }: Props) => {
  const [clientFormOpen, setClientFormOpen] = useState(false);
  const [journeysDialogOpen, setJourneysDialogOpen] = useState(false);
  const { selectedJourney, changeName, currentFilters } = useContext(ClientsContext);
  const [searchTerm, setSearchTerm] = useState('');

  const debounceValue = useDebounce(searchTerm, 500);
  useEffect(() => {
    changeName(debounceValue);
  }, [debounceValue]);


  return <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
    {
      clientFormOpen &&
      <ClientForm open={clientFormOpen} setOpen={setClientFormOpen} />
    }

    <JourneysDialog open={journeysDialogOpen} setOpen={setJourneysDialogOpen} />
    {
      activeTab === 'kanban' && <div className="flex flex-row gap-1 ">
        <VizualizationModeDropdownMenu triggerButton={
          <Button className="text-primary border-primary w-full" variant="outline">
            Tipo de vizualização:
            {
              selectedJourney ? <span className="font-bold">Jornada: {selectedJourney.name}</span> :
                <span className="font-bold">Status</span>
            }
            <ChevronDownCircle />
          </Button>
        } />

      </div>
    }
    <SearchInput
      defaultValue={currentFilters.name}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Filtrar por nome do cliente..."
      className="md:w-80 w-full" />
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