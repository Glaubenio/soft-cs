import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ClientContact } from "@/types/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle, Loader2, PlusCircle, XCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import { withMask } from 'use-mask-input';


interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  contactIndex?: number
  allContacts: ClientContact[]
  clientId: string
  onNewContactData?: (data: ClientContact[]) => void
}
const formSchema = z.object({
  name: z.string({ errorMap: () => ({ message: "Campo obrigatório" }) }).min(1, { message: "Campo obrigatório" }),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
  jobTitle: z.string().optional(),
});



export const ContactForm = ({ open, setOpen, allContacts, contactIndex, clientId, onNewContactData }: Props) => {
  const editingContact = contactIndex === undefined ? undefined : allContacts[contactIndex]

  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: editingContact?.name || "",
      phoneNumber: editingContact?.phoneNumber || "",
      email: editingContact?.email || "",
      jobTitle: editingContact?.jobTitle || "",
    }
  })

  const onSubmit = async (data: any) => {
    try {
      const contactData = [...(allContacts || [])]
      if (editingContact) {
        contactData[contactIndex!] = {
          ...contactData[contactIndex!],
          ...data
        }
      } else {
        contactData.push(data)
      }

      await axios.post(`/api/clients/${clientId}/contacts`, contactData)
      setOpen(false)
      if (onNewContactData) {
        onNewContactData(contactData)
      }
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
        <DialogTitle className="hidden">{editingContact ? 'Editar contato' : 'Criar contato'}</DialogTitle>
        <div className="flex flex-row items-start items-center">
          <div className="flex w-[46px] h-[46px] bg-light-purple justify-center items-center rounded-full">
            <PlusCircle className="text-primary" />
          </div>
          <div className="flex ml-[16px] h-full">{editingContact ? 'Editar contato' : 'Criar contato'}</div>

        </div>
        <div className="flex flex-row gap-2">
          <Button type="submit" form="contact-form" className="[&_svg]:size-[12px]">
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
        <form id="contact-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-0">
          <div className="flex flex-row items-center justify-between gap-3 mt-[16px]">
            <div className="flex flex-1 flex-col mt-[16px] ">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel className="text-[12px] font-[400] text-light-gray">Nome</FormLabel>
                    <FormControl>
                      <Input  {...field} className="bg-lighter-gray border-foreground border mt-[6px]" placeholder="Nome e Sobrenome" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-1 flex-col mt-[16px]">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel className="text-[12px] font-[400] text-light-gray">Cargo</FormLabel>
                    <FormControl>
                      <Input  {...field} className="bg-lighter-gray border-foreground border mt-[6px]" placeholder="Executivo" />
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
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel className="text-[12px] font-[400] text-light-gray">Celular</FormLabel>
                    <FormControl ref={withMask("(99) [9]9999-9999")}>
                      <Input  {...field} pattern="\d*" className="bg-lighter-gray border-foreground border mt-[6px]" placeholder="(85) 9 98279371" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-1 flex-col mt-[16px]">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel className="text-[12px] font-[400] text-light-gray">E-mail</FormLabel>
                    <FormControl>
                      <Input  {...field} className="bg-lighter-gray border-foreground border mt-[6px]" type="email" placeholder="exemplo@email.com" />
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