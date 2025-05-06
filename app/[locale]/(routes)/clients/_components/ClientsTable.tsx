import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, EllipsisVertical } from "lucide-react"
const fakeData = [
  {
    name: "Carla Valentin",
    avatarUrl: `${process.env.NEXT_PUBLIC_APP_URL}/images/nouser.png`,
    status: "Ativo",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    revenue: "R$ 12.000,00",
    journey: "Risco de churn",
    csm: "Tony Stark",
    level: "Tech",
  },
  {
    name: "Cersei Lannister",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    avatarUrl: `${process.env.NEXT_PUBLIC_APP_URL}/images/nouser.png`,
    status: "Cancelamento",
    journey: "Adoção",
    revenue: "R$ 15.000,00",
    csm: "Jon Snow",
    level: "Low",
  },
  {
    name: "Robert Baratheon",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    avatarUrl: `${process.env.NEXT_PUBLIC_APP_URL}/images/nouser.png`,
    status: "Em risco",
    journey: "Expansão",
    revenue: "R$ 120.000,00",
    csm: "Daenerys Targaryen",
    level: "Tech",
  },
  {
    name: "Robert Baratheon",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    avatarUrl: `${process.env.NEXT_PUBLIC_APP_URL}/images/nouser.png`,
    status: "Em risco",
    journey: "Risco de churn",
    revenue: "R$ 120.000,00",
    csm: "Daenerys Targaryen",
    level: "Low",
  },
]
const ClientRow = ({ name, avatarUrl, status, description, journey, revenue, csm, level }: any) => {
  const getStatusColor = () => {
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

  const getJourneyColor = () => {
    switch (journey) {
      case "Adoção":
        return 'green'
      case "Risco de churn":
        return 'red'
      case "Expansão":
        return 'yellow'
      default:
        return 'gray';
    }
  }
  const statusColor = getStatusColor();
  const journeyColor = getJourneyColor();
  return <TableRow>
    <TableCell>
      <div className="flex flex-row gap-2 items-center text-[14px] font-[400]">
        <Avatar className="size-[24px]">
          <AvatarImage
            src={avatarUrl ? avatarUrl : `${process.env.NEXT_PUBLIC_APP_URL}/images/nouser.png`}
          />
        </Avatar>{name}
      </div>
    </TableCell>
    <TableCell className="text-[12px] font-[400]">{description}</TableCell>
    <TableCell>
      <div className={`bg-light-${statusColor} rounded-full flex flex-row items-center px-[12px] w-fit py-[4px]`}>
        <div className={`size-[6px] bg-dot-${statusColor} rounded-full inline-block mr-[8px]`} />
        <div className={`text-dot-${statusColor} text-[10px] font-[700]`}>
          {status}
        </div>
      </div>
    </TableCell>
    <TableCell>
      <div className={`bg-light-${journeyColor} rounded-full flex flex-row items-center px-[12px] w-fit py-[4px]`}>
        <div className={`size-[6px] bg-dot-${journeyColor} rounded-full inline-block mr-[8px]`} />
        <div className={`text-dot-${journeyColor} text-[10px] font-[700]`}>
          {journey}
        </div>
      </div>
    </TableCell>
    <TableCell className="text-[14px] font-[400]">{revenue}</TableCell>
    <TableCell className="text-[14px] font-[400]">{csm}</TableCell>
    <TableCell>
      <div className={`bg-menu-active rounded-full flex flex-row items-center px-[12px] w-fit py-[4px]`}>
        <div className={`text-primary text-[10px] font-[700]`}>
          {level}
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

export const ClientsTable = ({ data }: any) => <div className="flex gap-2 py-10">
  <Table className="bg-white rounded-[20px]">
    <TableHeader>
      <TableRow>
        <TableHead>Nome</TableHead>
        <TableHead>Descrição</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Jornada</TableHead>
        <TableHead>RR de Contrato</TableHead>
        <TableHead>CSM Responsável</TableHead>
        <TableHead>Atendimento</TableHead>
        <TableHead></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {fakeData.map((client, index) => (
        <ClientRow
          key={index}
          name={client.name}
          avatarUrl={client.avatarUrl}
          status={client.status}
          description={client.description}
          revenue={client.revenue}
          csm={client.csm}
          level={client.level}
          journey={client.journey}
        />
      ))}
    </TableBody>
  </Table>
</div>