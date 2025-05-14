'use client'
import { TaskForm } from "../forms/Task"
import { Button } from "@/components/ui/button"
import { PlusCircle, Sliders } from "lucide-react"
import { ReactNode, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { User } from "@/types/types"
interface Props {
  activeUsers: User[]
}
const FilterDropDownMenu = ({ triggerButton }: { triggerButton: ReactNode }) => <DropdownMenu>
  <DropdownMenuTrigger asChild>
    {triggerButton}
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuLabel>Tipo de atendimento</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <div className="flex items-center gap-2 px-2">
        <Checkbox />High
      </div>
      <div className="flex items-center gap-2 px-2">
        <Checkbox />Low
      </div>
      <div className="flex items-center gap-2 px-2">
        <Checkbox />Tech
      </div>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuLabel>CSM Responsável</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <div className="flex items-center gap-2 px-2">
        <Checkbox />Jon Snow
      </div>
      <div className="flex items-center gap-2 px-2">
        <Checkbox />Cersei Lannister
      </div>
      <div className="flex items-center gap-2 px-2">
        <Checkbox />Tyrion Lannister
      </div>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuLabel>Status</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <div className="flex items-center gap-2 px-2">
        <Checkbox />Ativo
      </div>
      <div className="flex items-center gap-2 px-2">
        <Checkbox />Inativo
      </div>
      <div className="flex items-center gap-2 px-2">
        <Checkbox />Em Implantação
      </div>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
  </DropdownMenuContent>
</DropdownMenu>

export const TasksToolbar = () => {
  const [clientFormOpen, setClientFormOpen] = useState(false);

  return <div className="flex flex-row gap-1">
    <TaskForm open={clientFormOpen} setOpen={setClientFormOpen} />
    <FilterDropDownMenu triggerButton={(
      <Button className="md:py-2 md:px-4 md:h-10 md:rounded-[12px] md:text-sm text-[12px] py-1.5 px-3 h-auto rounded-sm">
        <Sliders /> Filtrar
      </Button>)
    } />

    <Button className="md:py-2 md:px-4 md:h-10 md:rounded-[12px] md:text-sm text-[12px] py-1.5 px-3 h-auto rounded-sm" onClick={() => setClientFormOpen(true)}>
      <PlusCircle /> Nova Tarefa
    </Button>
  </div>
}