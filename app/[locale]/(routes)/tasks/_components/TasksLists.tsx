'use client';
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, EllipsisVertical, Trash } from "lucide-react"
import { useTranslations } from "next-intl"
import { useContext, useState } from "react"
import { TasksContext } from "../tasks-context"
import { Task } from "@/types/types";
import { TaskForm } from "../forms/Task";
import AlertModal from "@/components/modals/alert-modal";


const TaskRow = ({ onEditClick, onDeleteClick, task }: {
  task: Task,
  onDeleteClick: (task: Task) => void,
  onEditClick: (task: Task) => void
}) => {
  const { title, content, responsible, status, priority, startDate, endDate } = task;
  const t = useTranslations();

  const priorityColor = t(`TaskPriority.color.${priority}`);
  return <TableRow>
    <TableCell className="text-[12px] font-[400]">
      {title}
    </TableCell>
    <TableCell className="text-[12px] font-[400]">{content}</TableCell>
    <TableCell className="text-[12px] font-[400]">
      {responsible?.name || '-'}
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
    <TableCell className="text-[14px] font-[400]">{startDate?.toLocaleDateString()}</TableCell>
    <TableCell className="text-[14px] font-[400]">{endDate?.toLocaleDateString()}</TableCell>
    <TableCell className="space-x-2 flex flex-row items-center">
      <Button onClick={() => onEditClick(task)}>
        <Edit className="w-4 h-4" />
      </Button>
      <Button onClick={() => onDeleteClick(task)}>
        <Trash className="w-4 h-4" />
      </Button>
    </TableCell>
  </TableRow>
}

const TasksCardList = ({ tasks, onEditClick, onDeleteClick }: {
  tasks: Task[],
  onDeleteClick: (task: Task) => void,
  onEditClick: (task: Task) => void
}) => {
  const t = useTranslations();


  return <div className="md:hidden flex flex-col gap-2">
    {tasks.map((task) => {

      const priorityColor = t(`TaskPriority.color.${task.priority}`);
      return <div key={task.id} className="flex flex-col rounded-[12px] px-[12px] py-[14px] bg-white gap-2">
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-col">
            <div className="flex flex-row gap-2 items-center text-[18px] font-[400]">
              <div className="flex flex-col text-[18px]">
                {task.title}
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
            <Button onClick={() => onEditClick(task)} className="size-[28px] [&_svg]:size-[12px]" >
              <Edit />
            </Button>
            <Button className="size-[28px] [&_svg]:size-[12px]" onClick={() => onDeleteClick(task)}>
              <Trash />
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
            <div className="text-[12px] font-[700]">{task.responsible?.name || '-'}</div>
          </div>
        </div>
        <Separator className="my-[10px]" />
        < div className="flex flex-col w-full text-[10px] font-[400] text-light-gray" >
          Descrição:
          <div className="text-[12px] font-[400] text-foreground">
            {task.content}
          </div>
        </div>
      </div>
    })}
  </div>
}

export const TasksTable = ({ tasks, onEditClick, onDeleteClick }: {
  tasks: Task[],
  onDeleteClick: (task: Task) => void,
  onEditClick: (task: Task) => void
}) => <div className="hidden md:flex gap-2 py-10">
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
        {tasks.map((task, index) => (
          <TaskRow
            onDeleteClick={onDeleteClick}
            key={index}
            task={task}
            onEditClick={onEditClick}
          />
        ))}
      </TableBody>
    </Table>
  </div>

export const TasksLists = () => {
  const [editingModalInfo, setEditingModalInfo] = useState<{ open: boolean; task?: Task }>({
    open: false,
    task: undefined,
  });
  const [deleteModalInfo, setDeleteModalInfo] = useState<{ open: boolean; task?: Task }>({ open: false, task: undefined });
  const { tasks, deleteTask, deleting } = useContext(TasksContext);
  const onDeleteClick = (task: Task) => {
    setDeleteModalInfo({ open: true, task });
  }
  return <div>
    <AlertModal
      isOpen={deleteModalInfo.open}
      onClose={() => setDeleteModalInfo(prev => ({ ...prev, open: false }))}
      onConfirm={() => deleteTask(deleteModalInfo.task!, () => setDeleteModalInfo({ open: false, task: undefined }))}
      loading={deleting}
    />
    {editingModalInfo.open &&
      <TaskForm
        open={editingModalInfo.open}
        task={editingModalInfo.task}
        setOpen={(open) => setEditingModalInfo((prev) => ({ ...prev, open: open }))} />
    }
    <TasksTable
      onDeleteClick={onDeleteClick}
      tasks={tasks || []}
      onEditClick={(task) => setEditingModalInfo({ task, open: true })}
    />
    <TasksCardList
      onDeleteClick={onDeleteClick}
      tasks={tasks || []}
      onEditClick={(task) => setEditingModalInfo({ task, open: true })}
    />
  </div>
}