"use client";

import axios from "axios";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { ChevronsUpDown, Edit, EllipsisVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AlertModal from "@/components/modals/alert-modal";
import LoadingComponent from "@/components/LoadingComponent";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
interface Task {
  id: string
  name: string
  responsible: string
  status: string
  description: string
  priority: string
  startAt: string
  endAt: string
}

const fakeData = (): Task[] => [
  {
    id: Math.floor(Math.random() * 1000).toString(),
    name: "Matar o rei Raeagar",
    responsible: "Jamie Lannister",
    status: "done",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    priority: "high",
    startAt: new Date().toLocaleDateString(),
    endAt: new Date().toLocaleDateString()
  },
  {
    id: Math.floor(Math.random() * 1000).toString(),
    name: "Invadir kings Landing",
    responsible: "Daenerys Targaryen",
    status: "doing",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    priority: "low",
    startAt: new Date().toLocaleDateString(),
    endAt: new Date().toLocaleDateString()
  },
  {
    id: Math.floor(Math.random() * 1000).toString(),
    name: "Comprar espadas de aço valiriano",
    responsible: "Tyrion Lannister",
    status: "todo",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    priority: "normal",
    startAt: new Date().toLocaleDateString(),
    endAt: new Date().toLocaleDateString()
  }
]

const sections: { id: string; status: string; tasks: Task[] }[] = [
  {
    id: Math.floor(Math.random() * 1000).toString(),
    status: "todo",
    tasks: fakeData(),
  },
  {
    id: Math.floor(Math.random() * 1000).toString(),
    status: "doing",
    tasks: fakeData(),
  }, {
    id: Math.floor(Math.random() * 1000).toString(),
    status: "done",
    tasks: fakeData(),
  }
];

const ClientsKanban = (props: any) => {
  const t = useTranslations();
  const [data, setData]: any = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    setData(props.data);
    setIsLoading(false);
  }, [props.data]);

  const onDragEnd = async ({ source, destination }: DropResult) => {
    if (!destination) return;
    console.log(source, "source - onDragEnd");
    console.log(destination, "destination - onDragEnd");
    const sourceColIndex = data.findIndex(
      (e: any) => e.id === source.droppableId
    );
    const destinationColIndex = data.findIndex(
      (e: any) => e.id === destination.droppableId
    );

    const sourceCol = data[sourceColIndex];
    if (!sourceCol) return null;
    const destinationCol = data[destinationColIndex];

    const sourceSectionId = sourceCol.id;
    const destinationSectionId = destinationCol.id;

    const sourceTasks = [...sourceCol.tasks];
    const destinationTasks = [...destinationCol.tasks];

    if (source.droppableId !== destination.droppableId) {
      const [removed] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      data[sourceColIndex].tasks = sourceTasks;
      data[destinationColIndex].tasks = destinationTasks;
    } else {
      const [removed] = destinationTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      data[destinationColIndex].tasks = destinationTasks;
    }

    try {
      setData(data);
      await axios.put(`/api/projects/tasks/update-ClientsKanban-position`, {
        resourceList: sourceTasks,
        destinationList: destinationTasks,
        resourceSectionId: sourceSectionId,
        destinationSectionId: destinationSectionId,
      });
      toast({
        title: "Task moved",
        description: "New task position saved in database",
      });
    } catch (err) {
      alert(err);
    }
  };


  if (isLoading) return <LoadingComponent />;
  const isMobile = window.innerWidth < 768;

  return (
    <>
      <div className="flex flex-col space-y-2">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-col md:flex-row items-start gap-2">
            {sections?.map((section, index: any) => (
              <div
                className="flex flex-col items-center justify-center w-full md:w-[360px] mt-[12px]  bg-white rounded-[20px] "
                key={section.id}
              >
                <Droppable
                  isCombineEnabled={false}
                  isDropDisabled={false}
                  key={section.id}
                  droppableId={section.id}>
                  {(provided) => (
                    <Collapsible
                      open={isMobile ? undefined : true}
                      className="flex flex-col items-center justify-center w-full md:w-[360px] mt-[12px]  bg-white rounded-[20px] "
                      key={section.id}
                    >
                      <div className="flex flex-row justify-between items-center w-full py-[16px] px-[14px] shadow-soft-cs rounded-[12px] text-[16px] bg-white font-[700] border-0 border-t-4 border-solid border-primary">
                        {t(`TaskStatus.${section.status}`)}
                        <CollapsibleTrigger asChild className="flex md:hidden">
                          <Button variant="ghost" size="sm">
                            <ChevronsUpDown className="h-4 w-4" />
                            <span className="sr-only">Toggle</span>
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent>
                        {section.tasks?.map((task, index: any) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided: any, snapshot: any) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                cursor={
                                  snapshot.isDragging ? "grabbing" : "grab"
                                }
                                className="block bg-[#F7F8FF] flex-col items-start justify-center text-xs px-[14px] py-[12px] rounded-[12px] mb-[8px]"
                                type="button"
                              >
                                {/* Kanban card Header*/}
                                <div className="flex flex-row justify-between items-center w-full">
                                  <div className="flex flex-col">
                                    <div className="flex flex-row font-[400] text-[10px] mt-[6px] items-center gap-1">
                                      Prioridade:: <div className={`bg-light-${t(`TaskPriority.color.${task.priority}`)} rounded-full flex flex-row items-center px-[12px] w-fit py-[4px]`}>
                                        <div className={`h-[6px] w-[6px] bg-dot-${t(`TaskPriority.color.${task.priority}`)} rounded-full inline-block mr-[8px]`} />
                                        <div className={`text-dot-${t(`TaskPriority.color.${task.priority}`)} text-[10px] font-[700]`}>
                                          {t(`TaskPriority.label.${task.priority}`)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-row gap-1 items-center">
                                    <Button className="size-[28px] [&_svg]:size-[12px]" >
                                      <Edit />
                                    </Button>
                                    <Button className="size-[28px] [&_svg]:size-[12px]">
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
                                {/* Kanban card Body*/}
                                < div className="flex flex-col w-full text-[10px] font-[400] text-light-gray" >
                                  Descrição:
                                  <div className="text-[12px] font-[400]">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </CollapsibleContent>
                      {provided.placeholder}


                    </Collapsible>
                  )}
                </Droppable>
              </div >
            ))}
          </div >
        </DragDropContext >
      </div >
    </>
  );
};

export default ClientsKanban;
