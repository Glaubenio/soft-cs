import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Edit, PlusCircle, Trash, Waypoints, XCircle } from "lucide-react"
import { JourneyForm } from "./Form"
import { useState } from "react"

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
}

const JourneyRow = () => <div className="flex flex-col items-center justify-between gap-3 mt-[16px]">
  <div className="flex flex-row justify-between items-center w-full border-b border-light-gray pb-[6px]">
    <div className="text-light-gray text-[14px]">Jornada 1</div>
    <div className="flex flex-row gap-2">
      <Button className="size-[28px] [&_svg]:size-[12px]"><Edit /></Button>
      <Button className="size-[28px] [&_svg]:size-[12px]"><Trash /></Button>
    </div>
  </div>
  <div className="flex flex-row w-full gap-2">
    <div className="flex flex-row font-[400] text-[10px] mt-[6px] items-center gap-1">
      <div className={`bg-light-green rounded-full flex flex-row items-center px-[12px] w-fit py-[4px]`}>
        <div className={`h-[6px] w-[6px] bg-dot-green rounded-full inline-block mr-[8px]`} />
        <div className={`text-dot-green text-[10px] font-[700]`}>
          Etapa 1
        </div>
      </div>
    </div>
    <div className="flex flex-row font-[400] text-[10px] mt-[6px] items-center gap-1">
      <div className={`bg-light-red rounded-full flex flex-row items-center px-[12px] w-fit py-[4px]`}>
        <div className={`h-[6px] w-[6px] bg-dot-red rounded-full inline-block mr-[8px]`} />
        <div className={`text-dot-red text-[10px] font-[700]`}>
          Etapa 2
        </div>
      </div>
    </div>
    <div className="flex flex-row font-[400] text-[10px] mt-[6px] items-center gap-1">
      <div className={`bg-light-yellow rounded-full flex flex-row items-center px-[12px] w-fit py-[4px]`}>
        <div className={`h-[6px] w-[6px] bg-dot-yellow rounded-full inline-block mr-[8px]`} />
        <div className={`text-dot-yellow text-[10px] font-[700]`}>
          Etapa 3
        </div>
      </div>
    </div>
  </div>
</div>

export const JourneysDialog = ({ open, setOpen }: Props) => {
  const [formOpen, setFormOpen] = useState(false)
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent hidesCloseButton={true} className="bg-white rounded-[20px] max-w-[680px] gap-0">
      <JourneyForm open={formOpen} setOpen={setFormOpen} />
      <DialogHeader className="flex flex-row justify-between items-center">
        <DialogTitle className="hidden">Jornadas</DialogTitle>
        <div className="flex flex-row items-start items-center">
          <div className="flex size-[46px] bg-light-purple justify-center items-center rounded-full">
            <Waypoints className="text-primary" />
          </div>
          <div className="flex ml-[16px] h-full">Jornada</div>

        </div>
        <div className="flex flex-row gap-2">
          <Button onClick={() => setFormOpen(true)}>
            <PlusCircle />
            Nova Jornada
          </Button>
          <Button variant={"outline"} onClick={() => setOpen(false)} className="text-primary border-primary">
            <XCircle className="text-primary" />
            Fechar
          </Button>
        </div>
      </DialogHeader>
      <JourneyRow />
      <JourneyRow />
      <JourneyRow />
    </DialogContent>
  </Dialog>
}