'use client';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, ChevronDownCircle, Edit, EllipsisVertical, Loader2, PlusCircle, XCircle } from "lucide-react";
import { useContext, useRef, useState } from "react";
import { ContactForm } from "./Contact";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Client } from "@/types/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslations } from "next-intl";
import { ClientsContext } from "../clients-context";
import MoneyInput from "@/components/ui/money-input";


interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  client?: Client
}

const formSchema = z.object({
  name: z.string({ errorMap: () => ({ message: "Campo obrigatório" }) }).min(1, { message: "Campo obrigatório" }),
  status: z.enum(["ACTIVE", "INACTIVE", "IN_IMPLANTATION"], { errorMap: () => ({ message: "Campo obrigatório" }) }),
  description: z.string({ errorMap: () => ({ message: "Campo obrigatório" }) }).min(1, { message: "Campo obrigatório" }),
  userId: z.string().nullable(),
  recurringContractRevenue: z.number().min(0, { message: "Campo obrigatório" }),
  serviceType: z.enum(["HIGH", "LOW", "TECH"], { errorMap: () => ({ message: "Campo obrigatório" }) }),
});

export const ClientForm = ({ open, setOpen, client }: Props) => {
  const { activeUsers } = useContext(ClientsContext)
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const t = useTranslations()
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: client?.name || "",
      status: client?.status,
      description: client?.description || "",
      userId: client?.userId || undefined,
      recurringContractRevenue: client?.recurringContractRevenue || 0,
      serviceType: client?.serviceType || "LOW",
    }
  })

  const onSubmit = async (data: any) => {
    try {
      await (client ? axios.put(`/api/clients/${client?.id}`, data) : axios.post("/api/clients", data))
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

  return (<Dialog open={open} onOpenChange={setOpen}>
    <DialogContent hidesCloseButton={true} className="bg-white rounded-[20px] md:max-w-[680px] w-[calc(100vw-32px)] max-h-[calc(100vh-32px)] overflow-scroll">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-0">
          <DialogHeader className="flex flex-col-reverse md:flex-row md:justify-between md:items-center">
            <DialogTitle className="hidden">{client ? 'Editar cliente' : 'Criar cliente'}</DialogTitle>
            <div className="flex flex-row items-start">
              <Avatar className="w-[74px] h-[74px] brightness-[0.5]">
                <AvatarImage
                  src={`${process.env.NEXT_PUBLIC_APP_URL}/images/nouser.png`}
                />
                <Input ref={fileInputRef} className="hidden" id="picture" type="file" />
                <Button variant="ghost" onClick={() => fileInputRef.current?.click()} className="absolute size-[24px] [&_svg]:size-[12px] top-0 right-0 left-0 bottom-0 m-auto">
                  <Edit />
                </Button>
              </Avatar>

              <div className="flex flex-col ml-[16px]">
                <div className="flex flex-row items-center">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center">
                        <FormLabel className="w-[3.5rem] text-[12px] font-[400] text-light-gray">Nome:</FormLabel>
                        <FormControl>
                          <Input  {...field} className="ml-[8px] bg-lighter-gray" type="text" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-row items-center mt-[6px]">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center w-full">
                        <FormLabel className="w-[3.5rem] text-[12px] font-[400] text-light-gray">Status:</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger disabled={form.formState.isSubmitting} className="ml-[8px] bg-lighter-gray w-full">
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Status</SelectLabel>
                              <SelectItem value="ACTIVE">{t('ClientStatus.label.ACTIVE')}</SelectItem>
                              <SelectItem value="INACTIVE">{t('ClientStatus.label.INACTIVE')}</SelectItem>
                              <SelectItem value="IN_IMPLANTATION">{t('ClientStatus.label.IN_IMPLANTATION')}</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-2 justify-end md:self-start">
              <Button type="submit" className="[&_svg]:size-[12px]">
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
          <ContactForm setOpen={setContactFormOpen} open={contactFormOpen} />
          <Separator className="my-[16px]" />
          <div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem >
                  <FormLabel className="text-[12px] font-[400] text-light-gray">Descricão:</FormLabel>
                  <FormControl>
                    <Textarea  {...field} className="bg-lighter-gray border-foreground border mt-[6px]" rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex md:flex-row flex-col gap-2 justify-between md:items-center mt-[16px]">
            <div className="flex flex-col mt-[16px] w-full">
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="text-[12px] font-[400] text-light-gray">Modelo de Atendimento:</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger disabled={form.formState.isSubmitting} className="mt-[6px] bg-lighter-gray">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Modelo de atendimento</SelectLabel>
                          <SelectItem value="HIGH">{t('ClientServiceType.HIGH')}</SelectItem>
                          <SelectItem value="LOW">{t('ClientServiceType.LOW')}</SelectItem>
                          <SelectItem value="TECH">{t('ClientServiceType.TECH')}</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator orientation="vertical" />
            <div className="flex flex-col mt-[16px] w-full">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="text-[12px] font-[400] text-light-gray">CSM Responsável:</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger disabled={form.formState.isSubmitting} className="mt-[6px] bg-lighter-gray w-full">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>CSM Responsável</SelectLabel>
                          <SelectItem value="HIGH">{t('ClientServiceType.HIGH')}</SelectItem>
                          <SelectItem value="LOW">{t('ClientServiceType.LOW')}</SelectItem>
                          <SelectItem value="TECH">{t('ClientServiceType.TECH')}</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator orientation="vertical" />
            <div className="flex flex-col mt-[16px]  w-full">
              <MoneyInput
                form={form}
                labelClassName="text-[12px] font-[400] text-light-gray"
                className="mt-[6px] bg-lighter-gray"
                label="Receita recorrente de contrato"
                name="recurringContractRevenue"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-[16px] bg-lighter-gray px-[14px] py-[12px] rounded-[20px] mt-[16px]">
            <div className="flex flex-row justify-between items-center">
              <div className="text-[16px] font-[700]">Contatos</div>
              <Button
                onClick={() => setContactFormOpen(true)}
                variant="ghost"
                className="text-primary text-[12px] [&_svg]:size-[12px]">
                <PlusCircle />Adicionar contato
              </Button>
            </div>
            <Table>
              <TableHeader className="border-b">
                <TableHead className="text-[10px] px-0 h-[14px]">
                  Nome
                </TableHead>
                <TableHead className="text-[10px] px-0 h-[14px]">
                  Cargo
                </TableHead>
                <TableHead className="text-[10px] px-0 h-[14px]">
                  Celular
                </TableHead>
                <TableHead className="text-[10px] px-0 h-[14px]">
                  E-mail
                </TableHead>
                <TableHead className=" px-0 h-[14px]">
                </TableHead>
              </TableHeader>
              <TableBody>
                <TableCell className="text-[10px] p-0">
                  Salles Silva
                </TableCell>
                <TableCell className="text-[10px] p-0">
                  Atendente
                </TableCell>
                <TableCell className="text-[10px] p-0">
                  (85) 9 9999-9999
                </TableCell>
                <TableCell className="text-[10px] p-0">
                  email@email.com
                </TableCell>
                <TableCell className="p-0">
                  <Button className="size-[24px] [&_svg]:size-[12px]">
                    <Edit />
                  </Button>
                </TableCell>
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-col gap-2 mt-[16px] bg-lighter-gray px-[14px] py-[12px] rounded-[20px] mt-[16px]">
            <div className="flex flex-row justify-between items-center">
              <div className="text-[16px] font-[700]">Tarefas</div>
              <Button variant="ghost" className="text-primary text-[12px]"><PlusCircle className="h-[12px] w-[12px]" />Ver todos</Button>
            </div>
            <Table>
              <TableHeader className="border-b">
                <TableHead className="text-[10px] px-0 h-[14px]">
                  Nome
                </TableHead>
                <TableHead className="text-[10px] px-0 h-[14px]">
                  Responsável
                </TableHead>
                <TableHead className="text-[10px] px-0 h-[14px]">
                  Status
                </TableHead>
                <TableHead className="text-[10px] px-0 h-[14px]">
                  Prioridade
                </TableHead>
                <TableHead className="text-[10px] px-0 h-[14px]">
                  Início
                </TableHead>
                <TableHead className="text-[10px] px-0 h-[14px]">
                  Fim
                </TableHead>
                <TableHead className="px-0 h-[14px]">
                </TableHead>
              </TableHeader>
              <TableBody>
                <TableCell className="text-[10px] p-0">
                  Acompanhamento Estratégico do Cliente
                </TableCell>
                <TableCell className="text-[10px] p-0">
                  João Almeida
                </TableCell>
                <TableCell className="p-0">
                  <div className={`bg-menu-active rounded-full flex flex-row items-center px-[8px] w-fit py-[2px] text-primary text-[10px] whitespace-nowrap`}>
                    Em Andamento
                  </div>
                </TableCell>
                <TableCell className="p-0">
                  <div className={`bg-light-green rounded-full flex flex-row items-center px-[8px] w-fit py-[2px] text-dot-green text-[10px] whitespace-nowrap`}>
                    <div className={`h-[6px] w-[6px] bg-dot-green rounded-full inline-block mr-[8px]`} />

                    Ativo
                  </div>
                </TableCell>
                <TableCell className="text-[10px] p-0">
                  01/01/2023
                </TableCell>
                <TableCell className="text-[10px] p-0">
                  01/01/2023
                </TableCell>
                <TableCell className="p-0">
                  <div className="flex flex-1 gap-1 justify-center items-center">
                    <Button className="size-[28px] [&_svg]:size-[12px]">
                      <Edit />
                    </Button>
                    <Button className="size-[28px] [&_svg]:size-[12px]">
                      <EllipsisVertical />
                    </Button>
                  </div>
                </TableCell>
              </TableBody>
            </Table>
          </div>
        </form>
      </Form>
    </DialogContent>
  </Dialog >)
}