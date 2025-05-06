import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { hexToRgbA } from "@/lib/utils"
import { CheckCircle, PlusCircle, XCircle } from "lucide-react"
import React, { useState } from "react"

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
}

interface Step {
  color: string
  name: string
}

const StepLabel = ({ step: { color, name } }: { step: Step }) => {
  const colorStyles = {
    '--step-bg-color': hexToRgbA(color, 0.2),
    '--step-text-color': color,
  } as React.CSSProperties

  return (
    <div className="flex flex-row font-[400] text-[10px] mt-[6px] items-center gap-1">
      <div style={colorStyles}
        className={`bg-[--step-bg-color] rounded-full flex flex-row items-center px-[12px] w-fit py-[4px]`}>
        <div
          style={colorStyles}
          className={`h-[6px] w-[6px] bg-[--step-text-color] rounded-full inline-block mr-[8px]`} />
        <div style={colorStyles} className={`text-[--step-text-color] text-[10px] font-[700]`}>
          {name}
        </div>
      </div>
    </div>
  )
}

export const JourneyForm = ({ open, setOpen }: Props) => {
  const [steps, setSteps] = useState<Step[]>([])
  const addStep = () => {
    const newStep = {
      color: "#150F41",
      name: '',
    }
    setSteps((prev) => [...prev, newStep])
  }

  const changeStep = (index: number, fieldName: string, newValue: string) => {
    const newSteps = [...steps]
    console.log(index, fieldName, newValue)
    newSteps[index] = {
      ...newSteps[index],
      [fieldName]: newValue,
    }
    setSteps(newSteps)
  }

  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent hidesCloseButton={true} className="bg-white rounded-[20px] max-w-[680px] gap-0">
      <DialogHeader className="flex flex-row justify-between items-center">
        <DialogTitle className="hidden">Criar/Editar jornada</DialogTitle>
        <div className="flex flex-row items-start items-center">
          <div className="flex w-[46px] h-[46px] bg-light-purple justify-center items-center rounded-full">
            <PlusCircle className="text-primary" />
          </div>
          <div className="flex ml-[16px] h-full">Criar/Editar jornada</div>
        </div>
        <div className="flex flex-row gap-2">
          <Button className="[&_svg]:size-[12px]">
            <CheckCircle />
            Salvar
          </Button>
          <Button variant={"outline"} onClick={() => setOpen(false)} className="[&_svg]:size-[12px] text-primary border-primary">
            <XCircle className="text-primary" />
            Fechar
          </Button>
        </div>
      </DialogHeader>
      <div className="flex flex-row items-center mt-[16px]">
        <div className="flex flex-1 flex-col mt-[16px] ">
          <Label htmlFor="name" className="text-[12px] font-[400] text-light-gray">Nome da jornada</Label>
          <Input name="name" placeholder="Digite um nome para a sua jornada" className="mt-[6px] bg-lighter-gray" type="text" />
        </div>
      </div>
      <div className="flex flex-col items-center justify-between gap-3 mt-[16px]">
        <div className="flex flex-row justify-between items-center w-full border-b border-light-gray pb-[6px]">
          <div className="text-light-gray text-[14px]">Etapas da jornada</div>
          <Button className="[&_svg]:size-[12px]" onClick={() => addStep()}>
            <PlusCircle />Nova etapa
          </Button>
        </div>
        <div className="flex flex-col w-full gap-2">
          {
            steps.map((step, index) => <div className="flex flex-row items-center justify-between gap-3 p-[12px] bg-lighter-gray rounded-[8px]" key={index}>
              <div className="flex flex-1 flex-col">
                <Label htmlFor="name" className="text-[12px] font-[400] text-light-gray">Nome da etapa</Label>
                <Input
                  onChange={(e) => changeStep(index, "name", e.target.value)}
                  name="name"
                  placeholder="Digite um nome para a etapa da jornada"
                  className="mt-[6px] bg-lighter-gray"
                  type="text" />
              </div>
              <div className="flex flex-1 flex-col">
                <Label htmlFor="role" className="text-[12px] font-[400] text-light-gray">Cor</Label>
                <Input
                  name="role"
                  onChange={(e) => {
                    changeStep(index, "color", e.target.value)
                  }}
                  defaultValue={step.color}
                  placeholder="Executivo"
                  className="mt-[6px] bg-lighter-gray"
                  type="color" />
              </div>
            </div>
            )
          }
        </div>
        <div className="flex flex-row w-full gap-2">
          {
            steps.map((step, index) => <StepLabel key={index}
              step={step}
            />
            )
          }

        </div>
      </div>
    </DialogContent>
  </Dialog >
}