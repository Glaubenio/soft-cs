import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, EllipsisVertical } from "lucide-react"
import { useTranslations } from "next-intl"

interface Task {
  name: string
  responsible: string
  status: string
  description: string
  priority: string
  startAt: string
  endAt: string
}
const fakeData: Task[] = [
  {
    name: "Matar o rei Raeagar",
    responsible: "Jamie Lannister",
    status: "done",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    priority: "high",
    startAt: new Date().toISOString(),
    endAt: new Date().toISOString()
  },
  {
    name: "Invadir kings Landing",
    responsible: "Daenerys Targaryen",
    status: "doing",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    priority: "low",
    startAt: new Date().toISOString(),
    endAt: new Date().toISOString()
  },
  {
    name: "Comprar espadas de aço valiriano",
    responsible: "Tyrion Lannister",
    status: "todo",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    priority: "normal",
    startAt: new Date().toISOString(),
    endAt: new Date().toISOString()
  }
]
const TaskRow = ({ task: { name, responsible, status, description, priority, startAt, endAt } }: { task: Task }) => {
  const t = useTranslations();

 
  const priorityColor = t(`TaskPriority.color.${priority}`);
  return <TableRow>
    <TableCell className="text-[12px] font-[400]">
      {name}
    </TableCell>
    <TableCell className="text-[12px] font-[400]">{description}</TableCell>
    <TableCell className="text-[12px] font-[400]">
      {responsible}
    </TableCell>
    <TableCell>
      <div className={`bg-menu-active rounded-full flex flex-row items-center px-[12px] w-fit py-[4px]`}>
        <div className={`text-primary text-[10px] font-[700]`}>
          {t(`TaskStatus.${status}`)}
        </div>
      </div>
    </TableCell>
    <TableCell>
      <div className={`bg-light-${priorityColor} rounded-full flex flex-row items-center px-[12px] w-fit py-[4px]`}>
        <div className={`size-[6px] bg-dot-${priorityColor} rounded-full inline-block mr-[8px]`} />
        <div className={`text-dot-${priorityColor} text-[10px] font-[700]`}>
          {t(`TaskPriority.label.${priority}`)}
        </div>
      </div>
    </TableCell>
    <TableCell className="text-[14px] font-[400]">{startAt}</TableCell>
    <TableCell className="text-[14px] font-[400]">{endAt}</TableCell>
    <TableCell className="space-x-2 flex flex-row items-center">
      <Button>
        <Edit className="w-4 h-4" />
      </Button>
      <Button>
        <EllipsisVertical className="w-4 h-4" />
      </Button>
    </TableCell>
  </TableRow>
}

export const ClientsTable = ({ data }: any) => <div className="flex gap-2 py-10">
  <Table className="bg-white rounded-[20px]">
    <TableHeader>
      <TableRow>
        <TableHead>Nome</TableHead>
        <TableHead>Descrição</TableHead>
        <TableHead>Responsável</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Prioridade</TableHead>
        <TableHead>Início</TableHead>
        <TableHead>Fim</TableHead>
        <TableHead></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {fakeData.map((task, index) => (
        <TaskRow
          key={index}
          task={task}
        />
      ))}
    </TableBody>
  </Table>
</div>