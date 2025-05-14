'use client';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Edit, EllipsisVertical, PlusCircle, XCircle } from "lucide-react";
import { useRef, useState } from "react";
import { ContactForm } from "./Contact";

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
}

export const ClientForm = ({ open, setOpen }: Props) => {
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (<Dialog open={open} onOpenChange={setOpen}>
    <DialogContent hidesCloseButton={true} className="bg-white rounded-[20px] md:max-w-[680px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)] overflow-scroll">
      <DialogHeader className="flex flex-col-reverse md:flex-row md:justify-between md:items-center">
        <DialogTitle className="hidden">Criar/Editar cliente</DialogTitle>
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
        <div className="flex flex-row gap-2 justify-end md:self-start">
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
      <ContactForm setOpen={setContactFormOpen} open={contactFormOpen} />
      <Separator className="my-[16px]" />
      <div>
        <Label htmlFor="description" className="text-[12px] font-[400] text-light-gray">Descrição:</Label>
        <Textarea name="description" className="bg-lighter-gray border-foreground border mt-[6px]" rows={5} />
      </div>
      <div className="flex md:flex-row flex-col gap-2 justify-between md:items-center mt-[16px]">
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
    </DialogContent>
  </Dialog >)
}