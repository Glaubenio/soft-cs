import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Account, ClientContact } from "@/types/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle, Edit, Loader2, PlusCircle, XCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import { withMask } from 'use-mask-input';
import { useRouter } from "next/navigation"
import { AvatarImage } from "@radix-ui/react-avatar"
import { useContext, useRef, useState } from "react"
import { AccountsContext } from "../accounts-context"


interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  account?: Account
}

const formSchema = z.object({
  avatar: z.instanceof(File).optional(),
  name: z.string({ errorMap: () => ({ message: "Campo obrigatório" }) }).min(1, { message: "Campo obrigatório" }),
  cnpj: z.string({ errorMap: () => ({ message: "Campo obrigatório" }) }).min(1, { message: "Campo obrigatório" }),
  segment: z.string({ errorMap: () => ({ message: "Campo obrigatório" }) }).min(1, { message: "Campo obrigatório" }),
  size: z.string({ errorMap: () => ({ message: "Campo obrigatório" }) }).min(1, { message: "Campo obrigatório" }),
});

export const AccountForm = ({ open, setOpen, account }: Props) => {
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined)
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(account?.imageUpload?.image_url || undefined)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { refresh } = useContext(AccountsContext)
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avatar: undefined,
      name: account?.name || "",
      cnpj: account?.cnpj || "",
      segment: account?.segment || "",
      size: account?.size || "",
    }
  })

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData()
      if (avatarFile) {
        formData.append("avatar", avatarFile)
      }
      formData.append("name", data.name)
      formData.append("cnpj", data.cnpj)
      formData.append("segment", data.segment)
      formData.append("size", data.size)
      await (account ? axios.put(`/api/account/${account?.id}`, formData) : axios.post("/api/account", formData))
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

  const changeAvatarImage = async (file?: File) => {
    if (!file) {
      return;
    }
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent hidesCloseButton={true} className="bg-white rounded-[20px] max-w-[680px] gap-0">
      <Form {...form}>
        <form id="account-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-0">
          <DialogHeader className="flex flex-row justify-between items-center">
            <DialogTitle className="hidden">{account ? 'Editar conta' : 'Criar conta'}</DialogTitle>
            <div className="flex flex-row items-start">
              <Avatar className="w-[74px] h-[74px] brightness-[0.5]">
                <AvatarImage
                  src={avatarPreview || `${process.env.NEXT_PUBLIC_APP_URL}/images/nouser.png`}
                />
                <Input ref={fileInputRef} onChange={(e) => changeAvatarImage(e.target.files?.[0])} className="hidden" id="picture" type="file" />
                <Button type="button" variant="ghost" onClick={() => fileInputRef.current?.click()} className="absolute size-[24px] [&_svg]:size-[12px] top-0 right-0 left-0 bottom-0 m-auto">
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
                    name="cnpj"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center">
                        <FormLabel className="w-[3.5rem] text-[12px] font-[400] text-light-gray">CNPJ:</FormLabel>
                        <FormControl ref={withMask("99.999.999/9999-99")}>
                          <Input  {...field} className="ml-[8px] bg-lighter-gray" type="text" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
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

          <div className="flex flex-row gap-2">
            <div className="flex flex-1 flex-col mt-[16px] ">
              <FormField
                control={form.control}
                name="segment"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel className="text-[12px] font-[400] text-light-gray">Segmento</FormLabel>
                    <FormControl>
                      <Input  {...field} className="bg-lighter-gray border-foreground border mt-[6px]" placeholder="Moda" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-1 flex-col mt-[16px] ">
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel className="text-[12px] font-[400] text-light-gray">Tamanho</FormLabel>
                    <FormControl>
                      <Input  {...field} className="bg-lighter-gray border-foreground border mt-[6px]" placeholder="Micro" />
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