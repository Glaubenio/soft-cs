import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { User } from "@/types/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle, Loader2, PlusCircle, XCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { UsersContext } from "../users-context"


interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  user?: User
}

const formSchema = z.object({
  name: z.string({ errorMap: () => ({ message: "Campo obrigatório" }) }).min(1, { message: "Campo obrigatório" }),
  email: z.string({ errorMap: () => ({ message: "Campo obrigatório" }) }).min(1, { message: "Campo obrigatório" }),
  jobTitle: z.string({ errorMap: () => ({ message: "Campo obrigatório" }) }).min(1, { message: "Campo obrigatório" }),
  accountId: z.string({ errorMap: () => ({ message: "Campo obrigatório" }) }).min(1, { message: "Campo obrigatório" })
});

export const UserForm = ({ open, setOpen, user }: Props) => {
  const { accounts, refresh } = useContext(UsersContext)
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      jobTitle: user?.jobTitle || "",
      accountId: user?.account?.id || "",
    }
  })

  const onSubmit = async (data: any) => {
    try {
      await (user ? axios.put(`/api/user/${user?.id}`, data) : axios.post("/api/user", data))
      refresh()
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
        <DialogTitle className="hidden">{user ? 'Editar usuário' : 'Criar usuário'}</DialogTitle>
        <div className="flex flex-row items-start items-center">
          <div className="flex w-[46px] h-[46px] bg-light-purple justify-center items-center rounded-full">
            <PlusCircle className="text-primary" />
          </div>
          <div className="flex ml-[16px] h-full">{user ? 'Editar usuário' : 'Criar usuário'}</div>

        </div>
        <div className="flex flex-row gap-2">
          <Button type="submit" form="user-form" className="[&_svg]:size-[12px]">
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
        <form id="user-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-0">
          <div className="flex flex-1 flex-col mt-[16px] ">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem >
                  <FormLabel className="text-[12px] font-[400] text-light-gray">Nome de usuário</FormLabel>
                  <FormControl>
                    <Input  {...field} className="bg-lighter-gray border-foreground border mt-[6px]" placeholder="Nome de usuário" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row gap-2">
            <div className="flex flex-1 flex-col mt-[16px] ">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel className="text-[12px] font-[400] text-light-gray">Nome</FormLabel>
                    <FormControl>
                      <Input  {...field} className="bg-lighter-gray border-foreground border mt-[6px]" placeholder="Nome completo" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-1 flex-col mt-[16px] ">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel className="text-[12px] font-[400] text-light-gray">Nome</FormLabel>
                    <FormControl>
                      <Input  {...field} className="bg-lighter-gray border-foreground border mt-[6px]" placeholder="example@email.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <div className="flex flex-1 flex-col mt-[16px] ">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel className="text-[12px] font-[400] text-light-gray">Nome</FormLabel>
                    <FormControl>
                      <Input  {...field} className="bg-lighter-gray border-foreground border mt-[6px]" placeholder="Cargo" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-1 flex-col mt-[16px] ">
              <FormField
                control={form.control}
                name="accountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[12px] font-[400] text-light-gray">Conta</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger disabled={form.formState.isSubmitting} className="bg-lighter-gray border-foreground border mt-[6px]">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Conta</SelectLabel>
                          {accounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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