import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Account, ClientContact } from "@/types/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle, Loader2, PlusCircle, XCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import { withMask } from 'use-mask-input';
import { useRouter } from "next/navigation"


interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  account?: Account
}

const formSchema = z.object({
  name: z.string({ errorMap: () => ({ message: "Campo obrigatório" }) }).min(1, { message: "Campo obrigatório" })
});

export const AccountForm = ({ open, setOpen, account }: Props) => {
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: account?.name || "",
    }
  })

  const onSubmit = async (data: any) => {
    try {
      await (account ? axios.put(`/api/accounts/${account?.id}`, data) : axios.post("/api/accounts", data))
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

  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent hidesCloseButton={true} className="bg-white rounded-[20px] max-w-[680px] gap-0">
      <DialogHeader className="flex flex-row justify-between items-center">
        <DialogTitle className="hidden">{account ? 'Editar conta' : 'Criar conta'}</DialogTitle>
        <div className="flex flex-row items-start items-center">
          <div className="flex w-[46px] h-[46px] bg-light-purple justify-center items-center rounded-full">
            <PlusCircle className="text-primary" />
          </div>
          <div className="flex ml-[16px] h-full">{account ? 'Editar conta' : 'Criar conta'}</div>

        </div>
        <div className="flex flex-row gap-2">
          <Button type="submit" form="account-form" className="[&_svg]:size-[12px]">
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
        <form id="account-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-0">

          <div className="flex flex-1 flex-col mt-[16px] ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem >
                  <FormLabel className="text-[12px] font-[400] text-light-gray">Nome</FormLabel>
                  <FormControl>
                    <Input  {...field} className="bg-lighter-gray border-foreground border mt-[6px]" placeholder="Nome da conta" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </DialogContent>
  </Dialog>
}