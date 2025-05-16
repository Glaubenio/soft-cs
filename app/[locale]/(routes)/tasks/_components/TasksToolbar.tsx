'use client'
import { TaskForm } from "../forms/Task"
import { Button } from "@/components/ui/button"
import { PlusCircle, Sliders } from "lucide-react"
import { ReactNode, useContext, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { User } from "@/types/types"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { TasksContext } from "../tasks-context"

const FilterDropDownMenu = ({ triggerButton }: { triggerButton: ReactNode }) => {
  const router = useRouter()
  const { activeUsers } = useContext(TasksContext)
  const [filters, setFilters] = useState<{
    status: string[]
    priority: string[]
    responsibleId: string[]
  }>({ status: [], priority: [], responsibleId: [] })

  const handleSelectedFilter = (name: 'status' | 'priority' | 'responsibleId', value: string) => {
    if (filters[name]?.includes(value)) {
      setFilters({
        ...filters,
        [name]: filters[name].filter((s) => s !== value),
      })
    } else {
      setFilters({
        ...filters,
        [name]: [...filters[name], value],
      })
    }
  }

  const t = useTranslations()

  const submitFilters = () => {
    router.push(`/tasks?status=${filters.status.join(',')}` +
      `&priority=${filters.priority.join(',')}` +
      `&responsibleId=${filters.responsibleId.join(',')}`)
  }

  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      {triggerButton}
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel>Status</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <div className="flex items-center gap-2 px-2">
          <Checkbox onCheckedChange={() => handleSelectedFilter("status", "TODO")} />{t('TaskStatus.TODO')}
        </div>
        <div className="flex items-center gap-2 px-2">
          <Checkbox onCheckedChange={() => handleSelectedFilter("status", "DOING")} />{t('TaskStatus.DOING')}
        </div>
        <div className="flex items-center gap-2 px-2">
          <Checkbox onCheckedChange={() => handleSelectedFilter("status", "DONE")} />{t('TaskStatus.DONE')}
        </div>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuLabel>Prioridade</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <div className="flex items-center gap-2 px-2">
          <Checkbox
            onCheckedChange={() => handleSelectedFilter("priority", "HIGH")}
          />{t('TaskPriority.label.HIGH')}
        </div>
        <div className="flex items-center gap-2 px-2">
          <Checkbox
            onCheckedChange={() => handleSelectedFilter("priority", "MEDIUM")}
          />{t('TaskPriority.label.MEDIUM')}
        </div>
        <div className="flex items-center gap-2 px-2">
          <Checkbox
            onCheckedChange={() => handleSelectedFilter("priority", "LOW")}
          />{t('TaskPriority.label.LOW')}
        </div>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuLabel>CSM Responsável</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        {activeUsers.map((user: User) => <div key={user.id} className="flex items-center gap-2 px-2">
          <Checkbox
            onCheckedChange={() => handleSelectedFilter("responsibleId", user.id)}
          />{user.name}
        </div>
        )
        }
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <Button
        onClick={() => submitFilters()}
        className="float-right mr-1">
        Aplicar
      </Button>
    </DropdownMenuContent>
  </DropdownMenu>
}

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