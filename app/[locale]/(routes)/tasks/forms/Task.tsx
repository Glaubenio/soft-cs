import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { CheckCircle, Edit, Loader2, PlusCircle, XCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useContext } from 'react';
import { TasksContext } from "../tasks-context"
import { useToast } from "@/components/ui/use-toast"
import { Task } from "@/types/types"

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  task: Task | null
}

const formSchema = z.object({
  clientId: z.string({ errorMap: () => ({ message: "Campo obrigatório" }) }).min(1, { message: "Campo obrigatório" }),
  responsibleId: z.string({ errorMap: () => ({ message: "Campo obrigatório" }) }).min(1, { message: "Campo obrigatório" }),
  title: z.string({ errorMap: () => ({ message: "Campo obrigatório" }) }).min(1, { message: "Campo obrigatório" }),
  status: z.enum(["TODO", "DOING", "DONE", "DELAYED"], { errorMap: () => ({ message: "Campo obrigatório" }) }),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"], { errorMap: () => ({ message: "Campo obrigatório" }) }),
  content: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional()

});

export const TaskForm = ({ open, setOpen, task }: Props) => {
  const t = useTranslations()
  const { toast } = useToast();

  const { activeUsers } = useContext(TasksContext)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: task?.clientId || "",
      responsibleId: task?.responsibleId || "",
      title: task?.title || "",
      status: task?.status || "TODO",
      priority: task?.priority || "HIGH",
      content: task?.content || "",
      startDate: task?.startDate ? new Date(task.startDate).toISOString().split('T')[0] : "",
      endDate: task?.endDate ? new Date(task.endDate).toISOString().split('T')[0] : ""
    }
  })

  console.log(form.formState.errors)

  const onSubmit = async (data: any) => {
    try {
      data.startDate = data.startDate ? new Date(data.startDate) : null
      data.endDate = data.endDate ? new Date(data.endDate) : null
      await (task ? axios.put(`/api/tasks/${task?.id}`, data) : axios.post("/api/tasks", data))
      window.location.reload()
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Erro desconhecido"
      toast({
        title: "Error",
        description: errorMessage,
      });
    }

  }
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent hidesCloseButton={true} className="bg-white rounded-[20px] max-w-[680px] gap-0">
      <DialogHeader className="flex flex-row justify-between items-center">
        <DialogTitle className="hidden">{task ? `Editar tarefa` : 'Criar tarefa'}</DialogTitle>
        <div className="flex flex-row items-start items-center">
          <div className="flex w-[46px] h-[46px] bg-light-purple justify-center items-center rounded-full">
            {task ? <Edit className="text-primary" /> : <PlusCircle className="text-primary" />}
          </div>
          <div className="flex ml-[16px] h-full">{task ? `Editar tarefa` : 'Criar tarefa'}</div>

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
      </DialogHeader>
      <Form {...form}>
        <form id="task-form" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-row items-center justify-between gap-3 mt-[16px]">
            <div className="flex flex-1 flex-col mt-[16px] ">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[14px] font-[400] text-light-gray">Cliente:</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger disabled={form.formState.isSubmitting} className="mt-[6px]">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Clientes</SelectLabel>
                          <SelectItem value="client1">Cliente 1</SelectItem>
                          <SelectItem value="client2">Cliente 2</SelectItem>
                          <SelectItem value="client3">Cliente 3</SelectItem>
                          <SelectItem value="client4">Cliente 4</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-1 flex-col mt-[16px] ">
              <FormField
                control={form.control}
                name="responsibleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[14px] font-[400] text-light-gray">CSM Responsável:</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger disabled={form.formState.isSubmitting} className="mt-[6px]">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>{"CSM's"} </SelectLabel>
                          {
                            activeUsers.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name}
                              </SelectItem>
                            ))
                          }

                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-row items-center justify-between gap-3 mt-[16px]">
            <div className="flex flex-1 flex-col mt-[16px] ">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[14px] font-[400] text-light-gray">Nome:</FormLabel>
                    <FormControl>
                      <Input disabled={form.formState.isSubmitting} {...field} placeholder="Digite o nome da tarefa" className="mt-[6px] bg-lighter-gray" type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-row items-center justify-between gap-3 mt-[16px]">
            <div className="flex flex-1 flex-col mt-[16px] ">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[14px] font-[400] text-light-gray">Status:</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger disabled={form.formState.isSubmitting} className="mt-[6px]">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem value="TODO">{t(`TaskStatus.TODO`)}</SelectItem>
                          <SelectItem value="DOING">{t(`TaskStatus.DOING`)}</SelectItem>
                          <SelectItem value="DONE">{t(`TaskStatus.DONE`)} </SelectItem>
                          <SelectItem value="DELAYED">{t(`TaskStatus.DELAYED`)} </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
            <div className="flex flex-1 flex-col mt-[16px] ">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[14px] font-[400] text-light-gray">Prioridade:</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger disabled={form.formState.isSubmitting} className="mt-[6px]">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Prioridade</SelectLabel>
                          <SelectItem value="HIGH">{t(`TaskPriority.label.HIGH`)}</SelectItem>
                          <SelectItem value="MEDIUM">{t(`TaskPriority.label.MEDIUM`)}</SelectItem>
                          <SelectItem value="LOW">{t(`TaskPriority.label.LOW`)} </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
          </div>
          <div className="flex flex-row items-center justify-between gap-3 mt-[16px]">
            <div className="flex flex-1 flex-col mt-[16px]">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[14px] font-[400] text-light-gray">Descrição:</FormLabel>
                    <FormControl>
                      <Textarea disabled={form.formState.isSubmitting} {...field} rows={2} className="mt-[6px] bg-lighter-gray border-light-gray" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
          </div>
          <div className="flex flex-row items-center justify-between gap-3 mt-[16px]">
            <div className="flex flex-1 flex-col mt-[16px] ">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[14px] font-[400] text-light-gray">Início (opcional):</FormLabel>
                    <FormControl>
                      <Input disabled={form.formState.isSubmitting} {...field} className="mt-[6px] bg-lighter-gray border" type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
            <div className="flex flex-1 flex-col mt-[16px]">
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[14px] font-[400] text-light-gray">Fim (opcional):</FormLabel>
                    <FormControl>
                      <Input disabled={form.formState.isSubmitting} {...field} className="mt-[6px] bg-lighter-gray border" type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </DialogContent>
  </Dialog>
}