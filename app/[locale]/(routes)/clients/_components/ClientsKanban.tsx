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
import { Edit, EllipsisVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AlertModal from "@/components/modals/alert-modal";
import LoadingComponent from "@/components/LoadingComponent";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
const clients = () => [
  {
    id: Math.floor(Math.random() * 1000).toString(),
    name: "Carla Valentin",
    avatarUrl: `${process.env.NEXT_PUBLIC_APP_URL}/images/nouser.png`,
    status: "Ativo",
    revenue: "R$ 12.000,00",
    csm: "Tony Stark",
  },
  {
    id: Math.floor(Math.random() * 1000).toString(),
    name: "Cersei Lannister",
    avatarUrl: `${process.env.NEXT_PUBLIC_APP_URL}/images/nouser.png`,
    status: "Cancelamento",
    revenue: "R$ 15.000,00",
    csm: "Jon Snow",
  },
  {
    id: Math.floor(Math.random() * 1000).toString(),
    name: "Robert Baratheon",
    avatarUrl: `${process.env.NEXT_PUBLIC_APP_URL}/images/nouser.png`,
    status: "Em risco",
    revenue: "R$ 120.000,00",
    csm: "Daenerys Targaryen",
  },
  {
    id: Math.floor(Math.random() * 1000).toString(),
    name: "Robert Baratheon",
    avatarUrl: `${process.env.NEXT_PUBLIC_APP_URL}/images/nouser.png`,
    status: "Em risco",
    revenue: "R$ 120.000,00",
    csm: "Daenerys Targaryen",
  }, {
    id: Math.floor(Math.random() * 1000).toString(),
    name: "Robert Baratheon",
    avatarUrl: `${process.env.NEXT_PUBLIC_APP_URL}/images/nouser.png`,
    status: "Em risco",
    revenue: "R$ 120.000,00",
    csm: "Daenerys Targaryen",
  }, {
    id: Math.floor(Math.random() * 1000).toString(),
    name: "Robert Baratheon",
    avatarUrl: `${process.env.NEXT_PUBLIC_APP_URL}/images/nouser.png`,
    status: "Em risco",
    revenue: "R$ 120.000,00",
    csm: "Daenerys Targaryen",
  }, {
    id: Math.floor(Math.random() * 1000).toString(),
    name: "Robert Baratheon",
    avatarUrl: `${process.env.NEXT_PUBLIC_APP_URL}/images/nouser.png`,
    status: "Em risco",
    revenue: "R$ 120.000,00",
    csm: "Daenerys Targaryen",
  }, {
    id: Math.floor(Math.random() * 1000).toString(),
    name: "Robert Baratheon",
    avatarUrl: `${process.env.NEXT_PUBLIC_APP_URL}/images/nouser.png`,
    status: "Em risco",
    revenue: "R$ 120.000,00",
    csm: "Daenerys Targaryen",
  },
]

const sections = [
  {
    id: Math.floor(Math.random() * 1000).toString(),
    title: "Adoção",
    clients: clients(),
  },
  {
    id: Math.floor(Math.random() * 1000).toString(),
    title: "Expansão",
    clients: clients(),
  }, {
    id: Math.floor(Math.random() * 1000).toString(),
    title: "Risco de churn",
    clients: clients(),
  }
];

let timer: any;
const timeout = 1000;

interface Task {
  id: string;
  section: string;
}

const ClientsKanban = (props: any) => {
  const boardId = props.boardId;

  const [data, setData]: any = useState([]);

  const [sectionId, setSectionId] = useState(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [open, setOpen] = useState(false);
  const [openSectionAlert, setOpenSectionAlert] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSection, setIsLoadingSection] = useState(false);

  const router = useRouter();

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

  const onDeleteSection = async () => {
    setIsLoadingSection(true);
    try {
      await axios.delete(`/api/projects/sections/delete-section/${sectionId}`);
      const newData = [...data].filter((e) => e.id !== sectionId);
      setData(newData);
      toast({
        title: "Section deleted",
        description: "Section deleted successfully",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong, during deleting section",
      });
    } finally {
      setIsLoadingSection(false);
      setSectionId(null);
      setOpenSectionAlert(false);
      router.refresh();
    }
  };

  //Done
  const updateSectionTitle = async (
    e: ChangeEvent<HTMLInputElement>,
    sectionId: string
  ) => {
    clearTimeout(timer);
    const newTitle = e.target.value;
    const newData = [...data];
    const index = newData.findIndex((e) => e.id === sectionId);
    newData[index].title = newTitle;
    setData(newData);
    timer = setTimeout(async () => {
      try {
        //updateSection(sectionId, { title: newTitle });
        await axios.put(`/api/projects/sections/update-title/${sectionId}`, {
          newTitle,
        });
        toast({
          title: "Section title updated",
          description: "New section title saved in database",
        });
      } catch (err) {
        alert(err);
      }
    }, timeout);
  };

  const onDelete = async () => {
    setOpen(false);
    setIsLoading(true);
    if (!selectedTask || !selectedTask.id || !selectedTask.section) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid task. Please select a valid task to delete.",
      });
      setIsLoading(false);
      return;
    }
    try {
      await axios.delete(`/api/projects/tasks/`, {
        data: {
          id: selectedTask.id,
          section: selectedTask.section,
        },
      });
      toast({
        title: "Task deleted",
        description: "Task deleted successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Task deleted",
        description: "Something went wrong, during deleting task",
      });
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  if (isLoading) return <LoadingComponent />;

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isLoading}
      />
      <AlertModal
        isOpen={openSectionAlert}
        onClose={() => setOpenSectionAlert(false)}
        onConfirm={onDeleteSection}
        loading={isLoadingSection}
      />
      <div className="flex flex-col space-y-2">
        <div className="flex">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-row items-start gap-2">
              {sections?.map((section: any, index: any) => (
                <div
                  className="flex flex-col items-center justify-center w-[360px] mt-[12px]  bg-white rounded-[20px] "
                  key={section.id}
                >
                  <Droppable
                    isCombineEnabled={false}
                    isDropDisabled={false}
                    key={section.id}
                    droppableId={section.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex flex-col w-full h-full px-[14px] py-[12px] rounded-[20px]"
                      >
                        <div className="flex flex-col py-[16px] px-[14px] shadow-soft-cs rounded-[12px] text-[16px] bg-white font-[700] border-0 border-t-4 border-solid border-primary">
                          {section?.title}
                        </div>
                        {section.clients?.map((client: any, index: any) => (
                          <Draggable
                            key={client.id}
                            draggableId={client.id}
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
                                    <div className="flex flex-row gap-2 items-center text-[18px] font-[400]">
                                      <Avatar className="w-[25px] h-[25px]">
                                        <AvatarImage
                                          src={client?.avatarUrl ? client?.avatarUrl : `${process.env.NEXT_PUBLIC_APP_URL}/images/nouser.png`}
                                        />
                                      </Avatar>{client.name}
                                    </div>
                                    <div className="flex flex-row font-[400] text-[10px] mt-[6px] items-center gap-1">
                                      Status: <div className={`bg-light-green rounded-full flex flex-row items-center px-[12px] w-fit py-[4px]`}>
                                        <div className={`h-[6px] w-[6px] bg-dot-green rounded-full inline-block mr-[8px]`} />
                                        <div className={`text-dot-green text-[10px] font-[700]`}>
                                          Ativo
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
                                {/* Kanban card Body*/}
                                < div className="flex flex-col w-full text-[10px] font-[400] text-light-gray" >
                                  Descrição:
                                  <div className="text-[12px] font-[400]">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                  </div>
                                  <div className="flex flex-row mt-[10px] gap-1">
                                    <div className={`bg-menu-active rounded-full flex flex-row items-center px-[8px] w-fit py-[2px] text-primary text-[10px] `}>
                                      RR:
                                      <div className={`font-[700]`}>
                                        R$ 12k
                                      </div>
                                    </div>
                                    <div className={`bg-menu-active rounded-full flex flex-row items-center px-[8px] w-fit py-[2px] text-primary text-[10px] `}>
                                      CSM:
                                      <div className={`font-[700]`}>
                                        Jon Snow
                                      </div>
                                    </div>
                                    <div className={`bg-menu-active rounded-full flex flex-row items-center px-[8px] w-fit py-[2px] text-primary text-[10px] `}>
                                      Atendimento:
                                      <div className={`font-[700]`}>
                                        Low
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}

                      </div>
                    )}
                  </Droppable>
                </div >
              ))}
            </div >
          </DragDropContext >
        </div >
      </div >
    </>
  );
};

export default ClientsKanban;
