import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Edit, Plus, PlusCircle, Trash, Waypoints, X, XCircle } from "lucide-react"
import { JourneyForm } from "./Form"
import { useContext, useState } from "react"
import { JourneysContext } from "../../journeys-context"
import { Journey } from "@/types/types"
import { StepLabel } from "./_components/StepLabel"
import AlertModal from "@/components/modals/alert-modal"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
}

const JourneyRow = ({ onDeleteClick, onEditClick, journey }: {
  journey: Journey,
  onEditClick: (journey: Journey) => void
  onDeleteClick: (journey: Journey) => void
}) => {
  const { name, journeySteps } = journey
  return <div className="flex flex-col items-center justify-between gap-3 mt-[16px]">
    <div className="flex flex-row justify-between items-center w-full border-b border-light-gray pb-[6px]">
      <div className="text-light-gray text-[14px]">{name}</div>
      <div className="flex flex-row gap-2">
        <Button onClick={() => onEditClick(journey)} className="size-[28px] [&_svg]:size-[12px]"><Edit /></Button>
        <Button onClick={() => onDeleteClick(journey)} className="size-[28px] [&_svg]:size-[12px]"><Trash /></Button>
      </div>
    </div>
    <div className="flex flex-row w-full gap-2">
      {
        journeySteps.map((step, index) => <StepLabel key={index}
          step={step}
        />)
      }
    </div>
  </div>
}

export const JourneysDialog = ({ open, setOpen }: Props) => {
  const { toast } = useToast()
  const router = useRouter()
  const [journeyFormInfo, setJourneyFormInfo] = useState<{ open: boolean; journey?: Journey }>({
    open: false,
  })

  const [deleting, setDeleting] = useState(false)
  const [deleteModalInfo, setDeleteModalInfo] = useState<{ open: boolean; journey?: Journey }>({
    open: false,
  })

  const deleteJourney = async (journey: Journey) => {
    setDeleting(true)
    try {
      const response = await axios.delete(`/api/journeys/${journey.id}`)
      console.log("Journey deleted", response.data);
      setDeleteModalInfo({ open: false, journey: undefined })
      router.refresh()
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Error deletando jornada";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }

    setDeleting(false)
  }

  const [formOpen, setFormOpen] = useState(false)
  const { journeys } = useContext(JourneysContext)
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent hidesCloseButton={true} className="bg-white rounded-[20px] md:max-w-[680px]  w-[calc(100vw-32px)] max-h-[calc(100vh-32px)] gap-0">
      {journeyFormInfo.open && <JourneyForm
        open={journeyFormInfo.open}
        journey={journeyFormInfo.journey}
        setOpen={(open) => setJourneyFormInfo(prev => ({ ...prev, open: false }))}
      />}
      <AlertModal
        isOpen={deleteModalInfo.open}
        onClose={() => setDeleteModalInfo(prev => ({ ...prev, open: false }))}
        onConfirm={() => deleteJourney(deleteModalInfo.journey!)}
        loading={deleting}
      />
      <DialogHeader className="flex flex-col">
        <DialogTitle className="hidden">Jornadas</DialogTitle>
        <div className="flex flex-row  justify-between items-center">
          <div className="flex flex-row items-start items-center">
            <div className="flex w-[46px] h-[46px] bg-light-purple justify-center items-center rounded-full">
              <Waypoints className="text-primary" />
            </div>
            <div className="flex md:flex hidden ml-[16px] h-full">Jornadas</div>
          </div>
          <div className="flex flex-row gap-2">
            <Button
              className="hidden md:flex [&_svg]:size-[12px] "
              onClick={() => setJourneyFormInfo(prev => ({ ...prev, open: true, journey: undefined }))}
            >
              <PlusCircle />
              Nova Jornada
            </Button>
            <Button variant={"outline"}
              onClick={() => setOpen(false)}
              className="hidden md:flex [&_svg]:size-[12px] text-primary border-primary"
            >
              <XCircle className="text-primary" />
              Fechar
            </Button>

            <Button
              className="flex md:hidden [&_svg]:size-[14px] "
              onClick={() => setJourneyFormInfo(prev => ({ ...prev, open: true, journey: undefined }))}
            >
              <Plus />
            </Button>
            <Button variant={"outline"}
              onClick={() => setOpen(false)}
              className="flex md:hidden [&_svg]:size-[14px] text-primary border-primary">
              <X className="text-primary" />
            </Button>
          </div>
        </div>
        <div className="flex flex md:hidden mt-1 h-full">Jornadas</div>
      </DialogHeader>
      {
        journeys.map((journey, index) => <JourneyRow
          onEditClick={(journey) => setJourneyFormInfo({ open: true, journey })}
          onDeleteClick={(journey) => setDeleteModalInfo({ open: true, journey })}
          key={index}
          journey={journey}
        />)
      }
    </DialogContent>
  </Dialog>
}