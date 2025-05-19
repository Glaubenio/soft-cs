'use client';
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, EllipsisVertical } from "lucide-react"
import { useContext } from "react"
import { ClientsContext } from "../clients-context"
import { useTranslations } from "next-intl"
import { Client } from "@/types/types"

const ClientRow = ({ client }: { client: Client }) => {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    unitDisplay: 'short',
    notation: 'compact',
    trailingZeroDisplay: 'stripIfInteger'
  });
  const t = useTranslations()
  const { name, status, description, recurringContractRevenue, serviceType, csmResponsible } = client
  const csmName = csmResponsible?.name || ""
  const statusColor = t(`ClientStatus.color.${status}`)
  return <TableRow>
    <TableCell>
      <div className="flex flex-row gap-2 items-center text-[14px] font-[400]">
        <Avatar className="size-[24px]">
          <AvatarImage
            src={`${process.env.NEXT_PUBLIC_APP_URL}/images/nouser.png`}
          />
        </Avatar>{name}
      </div>
    </TableCell>
    <TableCell className="text-[12px] font-[400]">{description}</TableCell>
    <TableCell>
      <div className={`bg-light-${statusColor} rounded-full flex flex-row items-center px-[12px] w-fit py-[4px]`}>
        <div className={`size-[6px] bg-dot-${statusColor} rounded-full inline-block mr-[8px]`} />
        <div className={`text-dot-${statusColor} text-[10px] font-[700]`}>
          {t(`ClientStatus.label.${status}`)}
        </div>
      </div>
    </TableCell>
    {/* <TableCell>
      <div className={`bg-light-${journeyColor} rounded-full flex flex-row items-center px-[12px] w-fit py-[4px]`}>
        <div className={`size-[6px] bg-dot-${journeyColor} rounded-full inline-block mr-[8px]`} />
        <div className={`text-dot-${journeyColor} text-[10px] font-[700]`}>
          {journey}
        </div>
      </div>
    </TableCell> */}
    <TableCell className="text-[14px] font-[400]">{formatter.format(recurringContractRevenue)}</TableCell>
    <TableCell className="text-[14px] font-[400]">{csmName}</TableCell>
    <TableCell>
      <div className={`bg-menu-active rounded-full flex flex-row items-center px-[12px] w-fit py-[4px]`}>
        <div className={`text-primary text-[10px] font-[700]`}>
          {serviceType}
        </div>
      </div>
    </TableCell>
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

// Desktop view
const ClientsTable = ({ clients }: { clients: Client[] }) => <div className="hidden md:flex gap-2 py-10">
  <Table className="bg-white rounded-[20px]">
    <TableHeader>
      <TableRow>
        <TableHead>Nome</TableHead>
        <TableHead>Descrição</TableHead>
        <TableHead>Status</TableHead>
        {/* <TableHead>Jornada</TableHead> */}
        <TableHead>RR de Contrato</TableHead>
        <TableHead>CSM Responsável</TableHead>
        <TableHead>Atendimento</TableHead>
        <TableHead></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {clients.map((client, index) => (
        <ClientRow
          key={index}
          client={client}
        />
      ))}
    </TableBody>
  </Table>
</div>

// Mobile view
const ClientsCardList = ({ clients }: { clients: Client[] }) => {
  const t = useTranslations()
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    trailingZeroDisplay: 'stripIfInteger'
  });
  return <div className="md:hidden flex flex-col gap-2">
    {clients.map((client, index) => {

      const { name, status, description, recurringContractRevenue, serviceType, csmResponsible } = client
      const csmName = csmResponsible?.name || ""
      const statusColor = t(`ClientStatus.color.${status}`)
      return <div key={String(index)} className="flex flex-col rounded-[12px] px-[12px] py-[14px] bg-white gap-2">
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-col">
            <div className="flex flex-row gap-2 items-center text-[18px] font-[400]">
              <Avatar className="size-[46px]">
                <AvatarImage
                  src={`${process.env.NEXT_PUBLIC_APP_URL}/images/nouser.png`}
                />
              </Avatar>
              <div className="flex flex-col text-[18px]">
                {name}
                <div className="flex flex-row font-[400] text-[10px] mt-[6px] items-center gap-1">
                  <div className={`bg-light-${statusColor} rounded-full flex flex-row items-center px-[12px] w-fit py-[4px]`}>
                    <div className={`h-[6px] w-[6px] bg-dot-${statusColor} rounded-full inline-block mr-[8px]`} />
                    <div className={`text-dot-${statusColor} text-[10px] font-[700]`}>
                      {t(`ClientStatus.label.${status}`)}
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
        < div className="flex flex-col w-full text-[10px] font-[400] text-light-gray" >
          Descrição:
          <div className="text-[12px] font-[400] text-foreground">
            {description}
          </div>
          <div className="flex flex-row mt-[10px] gap-1">
            <div className={`bg-menu-active rounded-full flex flex-row items-center px-[8px] w-fit py-[2px] text-primary text-[10px] `}>
              RR:
              <div className={`font-[700]`}>
                {formatter.format(recurringContractRevenue)}
              </div>
            </div>
            <div className={`bg-menu-active rounded-full flex flex-row items-center px-[8px] w-fit py-[2px] text-primary text-[10px] `}>
              CSM:
              <div className={`font-[700]`}>
                {csmName}
              </div>
            </div>
            <div className={`bg-menu-active rounded-full flex flex-row items-center px-[8px] w-fit py-[2px] text-primary text-[10px] `}>
              Atendimento:
              <div className={`font-[700]`}>
                {t(`ClientServiceType.${serviceType}`)}
              </div>
            </div>
          </div>
        </div>
      </div>
    })}
  </div>
}

export const ClientsList = ({ data }: any) => {
  const { clients } = useContext(ClientsContext)
  return <div>
    <ClientsTable clients={clients} />
    <ClientsCardList clients={clients} />
  </div>
}