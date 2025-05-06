import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CirclePlus } from "lucide-react";

const fakeData = [
  {
    name: "Carla Valentin",
    avatarUrl: `${process.env.NEXT_PUBLIC_APP_URL}/images/nouser.png`,
    status: "Ativo",
    revenue: "R$ 12.000,00",
    csm: "Tony Stark",
  },
  {
    name: "Cersei Lannister",
    avatarUrl: `${process.env.NEXT_PUBLIC_APP_URL}/images/nouser.png`,
    status: "Cancelamento",
    revenue: "R$ 15.000,00",
    csm: "Jon Snow",
  },
  {
    name: "Robert Baratheon",
    avatarUrl: `${process.env.NEXT_PUBLIC_APP_URL}/images/nouser.png`,
    status: "Em risco",
    revenue: "R$ 120.000,00",
    csm: "Daenerys Targaryen",
  },
  {
    name: "Robert Baratheon",
    avatarUrl: `${process.env.NEXT_PUBLIC_APP_URL}/images/nouser.png`,
    status: "Em risco",
    revenue: "R$ 120.000,00",
    csm: "Daenerys Targaryen",
  },
]

const ClientRow = ({ name, avatarUrl, status, revenue, csm }: any) => {
  const statusColor = () => {
    switch (status) {
      case "Ativo":
        return 'green'
      case "Cancelamento":
        return 'red'
      case "Em risco":
        return 'yellow'
      default:
        return 'gray';
    }
  }
  const color = statusColor();
  return <TableRow>
    <TableCell>
      <div className="flex flex-row gap-2 items-center text-[10px] font-[400]">
        <Avatar className="size-[24px]">
          <AvatarImage
            src={avatarUrl ? avatarUrl : `${process.env.NEXT_PUBLIC_APP_URL}/images/nouser.png`}
          />
        </Avatar>{name}
      </div>
    </TableCell>
    <TableCell>
      <div className={`bg-light-${color} rounded-full flex flex-row items-center px-[12px] w-fit py-[4px]`}>
        <div className={`h-[6px] w-[6px] bg-dot-${color} rounded-full inline-block mr-[8px]`} />
        <div className={`text-dot-${color} text-[10px] font-[700]`}>
          {status}
        </div>
      </div>
    </TableCell>
    <TableCell className="text-[10px] font-[400]">{revenue}</TableCell>
    <TableCell className="text-[10px] font-[400]">{csm}</TableCell>
  </TableRow>
}

const ClientsTable = () =>
  <div className="flex flex-col bg-white px-[14px] py-[12px] rounded-[20px] blur-sm">
    <div className="flex  flex-1 flex-row gap-2 justify-between">
      <div className="text-[16px] font-[700] h-[22px]">
        Clientes
      </div>
      <div>
        <Button variant="ghost" className="text-primary p-0 h-[22px]">
          <CirclePlus className="text-primary" />
          Ver todos
        </Button>
      </div>
    </div>
    <div className="max-h-[155px] overflow-y-scroll">
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead className="text-[10px] font-[400] text-light-gray">Nome</TableHead>
            <TableHead className="text-[10px] font-[400] text-light-gray">Status</TableHead>
            <TableHead className="text-[10px] font-[400] text-light-gray">RR de Contrato</TableHead>
            <TableHead className="text-[10px] font-[400] text-light-gray">CSM Responsável</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            fakeData.map((client, index) => (
              <ClientRow
                key={index}
                name={client.name}
                avatarUrl={client.avatarUrl}
                status={client.status}
                revenue={client.revenue}
                csm={client.csm}
              />
            ))
          }
        </TableBody>
      </Table>
    </div>
  </div>

export default ClientsTable;