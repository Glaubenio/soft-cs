"use client";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useContext, useState } from "react";
import { ChevronsUpDown, Edit, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import AlertModal from "@/components/modals/alert-modal";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ClientsContext } from "../clients-context";
import { useTranslations } from "next-intl";
import { ClientForm } from "../forms/Client";
import { Client } from "@/types/types";
import axios from "axios";

const ClientsKanban = (props: any) => {
  const { clients, selectedJourney, deleteClient, deleting, refresh } = useContext(ClientsContext);
  const [clientFormInfo, setClientFormInfo] = useState<{ open: boolean, client?: Client }>({
    open: false,
    client: undefined
  });
  const [deleteModalInfo, setDeleteModalInfo] = useState<{ open: boolean; client?: Client }>({
    open: false,
    client: undefined
  });

  const t = useTranslations()

  const groupedClients = () => {
    if (selectedJourney) {
      return selectedJourney.journeySteps.map((step) => {
        const stepClients = clients?.filter((client: any) => {
          return client?.journeyStepsClients?.find((stepClientAssociation: any) => {
            return stepClientAssociation.journeyStepId === step.id
          })
        });
        return {
          id: step.id,
          title: step.name,
          color: step.color,
          clients: stepClients || [],
        }
      })
    }
    return ["ACTIVE", "INACTIVE", "IN_IMPLANTATION"].map((status) => {
      return {
        id: status,
        title: t(`ClientStatus.label.${status}`),
        color: 'primary',
        clients: clients?.filter((client: any) => client.status === status) || [],
      };
    })
  }

  const reorderForStatus = async (source: any, destination: any) => {
    const { droppableId: sourceStatus, index: sourceIndex } = source;
    const { droppableId: destinationStatus } = destination;
    const clientToUpdate = groupedClients().find((section: any) => section.id === sourceStatus)?.clients[sourceIndex];
    if (!clientToUpdate) {
      console.log("Client not found");
      return;
    }
    const updatedClients = clients?.map((client: any) => {
      if (client.id === clientToUpdate.id) {
        return {
          ...client,
          status: destinationStatus,
        };
      }
      return client;
    }
    );
    refresh(updatedClients, { revalidate: false });
    await axios.put(`/api/clients/${clientToUpdate.id}`, {
      ...clientToUpdate,
      status: destinationStatus,
    })
  }

  const reorderForJourney = async (source: any, destination: any) => {
    const { droppableId: sourceJourneyStepId, index: sourceIndex } = source;
    const { droppableId: destinationJourneyStepId } = destination;
    const clientToUpdate = groupedClients().find((section: any) => section.id === sourceJourneyStepId)?.clients[sourceIndex];
    if (!clientToUpdate) {
      console.log("Client not found");
      return;
    }
    const updatedClients = clients?.map((client: any) => {
      if (client.id === clientToUpdate.id) {
        const updatedJourneySteps = client.journeyStepsClients.map((stepClientAssociation: any) => {
          if (stepClientAssociation.journeyStepId === sourceJourneyStepId) {
            return {
              ...stepClientAssociation,
              journeyStepId: destinationJourneyStepId,
            }
          }
          return stepClientAssociation;
        });
        return {
          ...client,
          journeyStepsClients: updatedJourneySteps,
        };
      }
      return client;
    }) || [];
    refresh(updatedClients, { revalidate: false });
    await axios.put(`/api/clients/${clientToUpdate.id}/updateJourneyStep`, {
      ...clientToUpdate,
      sourceJourneyStepId: sourceJourneyStepId,
      newJourneyStepId: destinationJourneyStepId,
    })
  }


  const onDragEnd = async ({ source, destination }: DropResult) => {
    if (!destination) return;
    if (selectedJourney) {
      await reorderForJourney(source, destination)
    } else {
      await reorderForStatus(source, destination)
    }
  };

  const isMobile = window.innerWidth < 768;
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    unitDisplay: 'short',
    notation: 'compact',
    trailingZeroDisplay: 'stripIfInteger'
  });
  return (
    <>
      <AlertModal
        isOpen={deleteModalInfo.open}
        onClose={() => setDeleteModalInfo(prev => ({ ...prev, open: false }))}
        onConfirm={() => deleteClient(deleteModalInfo.client!, () => setDeleteModalInfo({ open: false, client: undefined }))}
        loading={deleting}
      />
      {
        clientFormInfo.open &&
        <ClientForm
          open={clientFormInfo.open}
          setOpen={(open) => setClientFormInfo(prev => ({ ...prev, open: open }))}
          client={clientFormInfo.client} />
      }
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col md:flex-row">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col md:flex-row items-start gap-2">
              {groupedClients()?.map((section: any, index: any) => {
                const colorStyle = {
                  '--section-border-color': selectedJourney ? section.color : `hsl(var(--primary))`,
                } as React.CSSProperties;
                return (
                  <Collapsible
                    open={isMobile ? undefined : true}
                    className="flex flex-col items-center justify-center w-full md:w-[360px] mt-[12px] bg-white rounded-[20px] "
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

                          <div style={colorStyle} className="border-[--section-border-color] flex items-center justify-between flex-row py-[16px] px-[14px] shadow-soft-cs rounded-[12px] text-[16px] bg-white font-[700] border-0 border-t-4 border-solid">
                            {section?.title}
                            <CollapsibleTrigger asChild className="flex md:hidden">
                              <Button variant="ghost" size="sm">
                                <ChevronsUpDown className="h-4 w-4" />
                                <span className="sr-only">Toggle</span>
                              </Button>
                            </CollapsibleTrigger>
                          </div>

                          <CollapsibleContent>
                            {section.clients?.map((client: any, index: any) => {
                              const statusColor = t('ClientStatus.color.' + client.status);
                              return (
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
                                            Status: <div className={`bg-light-${statusColor} rounded-full flex flex-row items-center px-[12px] w-fit py-[4px]`}>
                                              <div className={`h-[6px] w-[6px] bg-dot-${statusColor} rounded-full inline-block mr-[8px]`} />
                                              <div className={`text-dot-${statusColor} text-[10px] font-[700]`}>
                                                {t('ClientStatus.label.' + client.status)}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex flex-row gap-1 items-center">
                                          <Button
                                            onClick={() => setClientFormInfo({ open: true, client: client })}
                                            className="size-[28px] [&_svg]:size-[12px]" >
                                            <Edit />
                                          </Button>
                                          <Button
                                            onClick={() => setDeleteModalInfo({ open: true, client: client })}
                                            className="size-[28px] [&_svg]:size-[12px]"
                                          >
                                            <Trash />
                                          </Button>
                                        </div>
                                      </div>
                                      <Separator className="my-[10px]" />
                                      {/* Kanban card Body*/}
                                      < div className="flex flex-col w-full text-[10px] font-[400] text-light-gray" >
                                        Descrição:
                                        <div className="text-[12px] font-[400] text-foreground">
                                          {client.description}
                                        </div>
                                        <div className="flex flex-row mt-[10px] gap-1">
                                          <div className={`bg-menu-active rounded-full flex flex-row items-center px-[8px] w-fit py-[2px] text-primary text-[10px] `}>
                                            RR:
                                            <div className={`font-[700]`}>
                                              {formatter.format(client.recurringContractRevenue)}
                                            </div>
                                          </div>
                                          <div className={`bg-menu-active rounded-full flex flex-row items-center px-[8px] w-fit py-[2px] text-primary text-[10px] `}>
                                            CSM:
                                            <div className={`font-[700]`}>
                                              {client.csmResponsible?.name}
                                            </div>
                                          </div>
                                          <div className={`bg-menu-active rounded-full flex flex-row items-center px-[8px] w-fit py-[2px] text-primary text-[10px] `}>
                                            Atendimento:
                                            <div className={`font-[700]`}>
                                              {t('ClientServiceType.' + client.serviceType)}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              )
                            })
                            }
                          </CollapsibleContent>
                          {provided.placeholder}

                        </div>
                      )}
                    </Droppable>
                  </Collapsible >
                )
              }

              )}
            </div >
          </DragDropContext >
        </div >
      </div >
    </>
  );
};

export default ClientsKanban;
