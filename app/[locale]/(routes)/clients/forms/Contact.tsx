import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, PlusCircle, XCircle } from "lucide-react"

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
}

export const ContactForm = ({ open, setOpen }: Props) => {
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent hidesCloseButton={true} className="bg-white rounded-[20px] max-w-[680px] gap-0">
      <DialogHeader className="flex flex-row justify-between items-center">
        <DialogTitle className="hidden">Criar/Editar contato</DialogTitle>
        <div className="flex flex-row items-start items-center">
          <div className="flex w-[46px] h-[46px] bg-light-purple justify-center items-center rounded-full">
            <PlusCircle className="text-primary" />
          </div>
          <div className="flex ml-[16px] h-full">Criar/Editar contato</div>

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
      <div className="flex flex-row items-center justify-between gap-3 mt-[16px]">
        <div className="flex flex-1 flex-col mt-[16px] ">
          <Label htmlFor="name" className="text-[12px] font-[400] text-light-gray">Nome</Label>
          <Input name="name" placeholder="Nome e Sobrenome" className="mt-[6px] bg-lighter-gray" type="text" />
        </div>
        <div className="flex flex-1 flex-col mt-[16px]">
          <Label htmlFor="role" className="text-[12px] font-[400] text-light-gray">Cargo</Label>
          <Input name="role" placeholder="Executivo" className="mt-[6px] bg-lighter-gray" type="text" />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between gap-3 mt-[16px]">
        <div className="flex flex-1 flex-col mt-[16px] ">
          <Label htmlFor="phone" className="text-[12px] font-[400] text-light-gray">Celular</Label>
          <Input name="phone" placeholder="(85) 9 98279371" className="mt-[6px] bg-lighter-gray" type="text" />
        </div>
        <div className="flex flex-1 flex-col mt-[16px]">
          <Label htmlFor="email" className="text-[12px] font-[400] text-light-gray">E-mail</Label>
          <Input name="email" placeholder="email@email.com" className="mt-[6px] bg-lighter-gray" type="email" />
        </div>
      </div>
    </DialogContent>
  </Dialog>
}