'use client';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
}

export const ClientForm = ({ open, setOpen }: Props) => {
  return (<Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="bg-white rounded-[20px] max-w-[680px]">
      <DialogHeader className="flex flex-row justify-between items-center">
        <DialogTitle className="hidden">Criar/Editar cliente</DialogTitle>
        <div className="flex flex-row items-start">
          <Avatar className="w-[74px] h-[74px]">
            <AvatarImage
              src={`${process.env.NEXT_PUBLIC_APP_URL}/images/nouser.png`}
            />
          </Avatar>
          <div className="flex flex-col ml-[16px]">
            <div className="flex flex-row items-center">
              <Label htmlFor="name" className="w-[3.5rem] text-[12px] font-[400] text-light-gray">
                Nome:
              </Label>
              <Input name="name" className="ml-[8px] bg-lighter-gray" type="text" />
            </div>
            <div className="flex flex-row items-center mt-[6px]">
              <Label htmlFor="status" className="w-[3.5rem] text-[12px] font-[400] text-light-gray">
                Status:
              </Label>
              <Input name="status" className="ml-[8px] bg-lighter-gray" type="text" />
            </div>
          </div>

        </div>
        <div>
          <Button>
            Salvar
          </Button>
        </div>
      </DialogHeader>
      <Separator className="my-[16px]" />
      <div>
        <Label htmlFor="description" className="text-[12px] font-[400] text-light-gray">Descrição:</Label>
        <Textarea name="description" className="bg-lighter-gray border-foreground border mt-[6px]" rows={5} />
      </div>
      <div className="flex flex-row gap-2 justify-between items-center mt-[16px]">
        <div className="flex flex-col mt-[16px]">
          <Label htmlFor="csm" className="text-[12px] font-[400] text-light-gray">Modelo de Atendimento:</Label>
          <Input name="csm" className="mt-[6px] bg-lighter-gray" type="text" />
        </div>
        <Separator orientation="vertical" />
        <div className="flex flex-col mt-[16px]">
          <Label htmlFor="csm" className="text-[12px] font-[400] text-light-gray">CSM Responsável:</Label>
          <Input name="csm" className="mt-[6px] bg-lighter-gray" type="text" />

        </div>
        <Separator orientation="vertical" />
        <div className="flex flex-col mt-[16px]">
          <Label htmlFor="csm" className="text-[12px] font-[400] text-light-gray">Receita Recorrente de Contrato:</Label>
          <Input name="revenue" className="mt-[6px] bg-lighter-gray" type="text" />
        </div>
      </div>
      <div>TODO: Contatos</div>
      <div>TODO: Tarefas</div>
    </DialogContent>
  </Dialog >)
}