import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
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

const TasksCardList = ({ data }: any) => {
  const t = useTranslations();



  return <div className="md:hidden flex flex-col gap-2">
    {fakeData.map((task) => {
      const priorityColor = t(`TaskPriority.color.${task.priority}`);
      return <div className="flex flex-col rounded-[12px] px-[12px] py-[14px] bg-white gap-2">
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-col">
            <div className="flex flex-row gap-2 items-center text-[18px] font-[400]">
              <div className="flex flex-col text-[18px]">
                {task.name}
                <div className="flex flex-row items-center text-[10px] font-[400] text-light-gray gap-1">
                  Prioridade:
                  <div className="flex flex-row font-[400] text-[10px] mt-[6px] items-center gap-1">
                    <div className={`bg-light-${priorityColor} rounded-full flex flex-row items-center px-[12px] w-fit py-[2px]`}>
                      <div className={`h-[6px] w-[6px] bg-dot-${priorityColor} rounded-full inline-block mr-[8px]`} />
                      <div className={`text-dot-${priorityColor} text-[10px] font-[700]`}>
                        {t('TaskPriority.label.' + task.priority)}
                      </div>
                    </div>
                  </div>
                  Status:
                  <div className="flex flex-row font-[400] text-[10px] mt-[6px] items-center gap-1">
                    <div className={`bg-menu-active rounded-full flex flex-row items-center px-[12px] w-fit py-[2px]`}>
                      <div className={`text-primary text-[10px] font-[700]`}>
                        {t(`TaskStatus.${task.status}`)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <Button className="size-[28px] [&_svg]:size-[12px]" >
              <Edit />
            </Button>
            <Button className="size-[28px] [&_svg]:size-[12px]" >
              <EllipsisVertical />
            </Button>
          </div>
        </div>
        <Separator className="my-[10px]" />
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-col">
            <div className="text-[10px]">Início:</div>
            <div className="text-[12px] font-[700]">{task.startAt}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-[10px]">Fim:</div>
            <div className="text-[12px] font-[700]">{task.endAt}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-[10px]">Responsável:</div>
            <div className="text-[12px] font-[700]">{task.responsible}</div>
          </div>
        </div>
        <Separator className="my-[10px]" />
        < div className="flex flex-col w-full text-[10px] font-[400] text-light-gray" >
          Descrição:
          <div className="text-[12px] font-[400] text-foreground">
            {task.description}
          </div>
        </div>
      </div>
    })}
  </div>
}

export const TasksTable = ({ data }: any) => <div className="hidden md:flex gap-2 py-10">
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

export const TasksLists = ({ data }: any) => {
  return <div>
    <TasksTable data={data} />
    <TasksCardList data={data} />
  </div>
}