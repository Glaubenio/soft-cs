import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { Journey } from "@/types/types"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { CheckCircle, Edit, Loader2, PlusCircle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import React from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { StepLabel } from "./_components/StepLabel"

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  journey?: Journey
}

const formSchema = z.object({
  name: z.string({ errorMap: () => ({ message: "Campo obrigatório" }) }).min(1, { message: "Campo obrigatório" }),
  steps: z.array(z.object({
    color: z.string({ errorMap: () => ({ message: "Campo obrigatório" }) }).min(1, { message: "Campo obrigatório" }),
    name: z.string({ errorMap: () => ({ message: "Campo obrigatório" }) }).min(1, { message: "Campo obrigatório" }),
  })),
});

export const JourneyForm = ({ open, setOpen, journey }: Props) => {
  const { toast } = useToast()
  const router = useRouter()
  const addStep = () => {
    const newStep = {
      color: "#150F41",
      name: '',
    }
    append(newStep)
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: journey?.name || "",
      steps: journey?.journeySteps || []
    }
  })

  const { fields, append } = useFieldArray({
    name: "steps",
    control: form.control,
  })

  const onSubmit = async (data: any) => {
    try {
      await (journey ? axios.put(`/api/journeys/${journey?.id}`, data) : axios.post("/api/journeys", data))
      router.refresh()

      setOpen(false)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Erro desconhecido"
      toast({
        title: "Error",
        description: errorMessage,
      });
    }
  }

  console.log(fields, "fields")

  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent hidesCloseButton={true} className="bg-white rounded-[20px] md:max-w-[680px] w-[calc(100vw-32px)] max-h-[calc(100vh-32px)] gap-0 overflow-scroll">
      <DialogHeader className="flex flex-col">
        <DialogTitle className="hidden">{journey ? `Editar jornada` : 'Adicionar jornada'}</DialogTitle>
        <div className="flex flex-row  justify-between items-center">
          <div className="flex flex-row items-start items-center">
            <div className="flex w-[46px] h-[46px] bg-light-purple justify-center items-center rounded-full">
              {journey ? <Edit className="text-primary" /> : <PlusCircle className="text-primary" />}
            </div>
            <div className="flex md:flex hidden ml-[16px] h-full">{journey ? `Editar jornada` : 'Adicionar jornada'}</div>
          </div>
          <div className="flex flex-row gap-2">
            <Button type="submit" form="task-form" className="[&_svg]:size-[12px]">
              {
                form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle />
              }

              Salvar
            </Button>
            <Button variant={"outline"} onClick={() => setOpen(false)} className="[&_svg]:size-[12px] text-primary border-primary">
              <XCircle className="text-primary" />
              Fechar
            </Button>
          </div>
        </div>
        <div className="flex flex md:hidden mt-1 h-full">{journey ? `Editar jornada` : 'Adicionar jornada'}</div>
      </DialogHeader>
      <Form {...form}>
        <form id="task-form" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-row items-center mt-[16px]">
            <div className="flex flex-1 flex-col mt-[16px] ">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[12px] font-[400] text-light-gray">Nome da jornada</FormLabel>
                    <FormControl>
                      <Input  {...field} placeholder="Digite um nome para a sua jornada" className="mt-[6px] bg-lighter-gray" type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                fields.map((field, index) => <div className="flex flex-row items-center justify-between gap-3 p-[12px] bg-lighter-gray rounded-[8px]" key={field.id}>
                  <div className="flex flex-1 flex-col">
                    <FormField
                      control={form.control}
                      name={`steps.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[12px] font-[400] text-light-gray">Nome da etapa</FormLabel>
                          <FormControl>
                            <Input  {...field} placeholder="Digite um nome para a sua jornada" className="mt-[6px] bg-lighter-gray" type="text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  </div>
                  <div className="flex flex-1 flex-col">
                    <FormField
                      control={form.control}
                      name={`steps.${index}.color`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[12px] font-[400] text-light-gray">Cor</FormLabel>
                          <FormControl>
                            <Input  {...field} placeholder="Digite um nome para a sua jornada" className="mt-[6px] bg-lighter-gray" type="color" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                )
              }
            </div>
            <div className="flex flex-wrap flex-row w-full gap-2">
              {
                form.watch('steps').map((step, index) => <StepLabel key={index}
                  step={step}
                />
                )
              }

            </div>
          </div>
        </form>
      </Form>
    </DialogContent>
  </Dialog>
}