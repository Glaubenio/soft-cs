import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, PlusCircle, XCircle } from "lucide-react"
import { useTranslations } from "next-intl"

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
}

export const TaskForm = ({ open, setOpen }: Props) => {
  const t = useTranslations()
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent hidesCloseButton={true} className="bg-white rounded-[20px] max-w-[680px] gap-0">
      <DialogHeader className="flex flex-row justify-between items-center">
        <DialogTitle className="hidden">Criar/Editar tarefa</DialogTitle>
        <div className="flex flex-row items-start items-center">
          <div className="flex w-[46px] h-[46px] bg-light-purple justify-center items-center rounded-full">
            <PlusCircle className="text-primary" />
          </div>
          <div className="flex ml-[16px] h-full">Criar/Editar tarefa</div>

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
          <Label htmlFor="client" className="text-[14px] font-[400] text-light-gray">Cliente:</Label>
          <Select name="client">
            <SelectTrigger className="mt-[6px]">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
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
        </div>
        <div className="flex flex-1 flex-col mt-[16px] ">
          <Label htmlFor="csm" className="text-[14px] font-[400] text-light-gray">CSM Responsável:</Label>
          <Select name="csm">
            <SelectTrigger className="mt-[6px]">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{"CSM's"} </SelectLabel>
                <SelectItem value="csm1">CSM 1</SelectItem>
                <SelectItem value="csm2">CSM 2</SelectItem>
                <SelectItem value="csm3">CSM 3</SelectItem>
                <SelectItem value="csm4">CSM 4</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between gap-3 mt-[16px]">
        <div className="flex flex-1 flex-col mt-[16px] ">
          <Label htmlFor="name" className="text-[14px] font-[400] text-light-gray">Nome:</Label>
          <Input name="name" placeholder="Digite o nome da tarefa" className="mt-[6px] bg-lighter-gray" type="text" />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between gap-3 mt-[16px]">
        <div className="flex flex-1 flex-col mt-[16px] ">
          <Label htmlFor="status" className="text-[14px] font-[400] text-light-gray">Status:</Label>
          <Select defaultValue="todo" name="status">
            <SelectTrigger className="mt-[6px]">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="todo">{t(`TaskStatus.todo`)}</SelectItem>
                <SelectItem value="doing">{t(`TaskStatus.doing`)}</SelectItem>
                <SelectItem value="done">{t(`TaskStatus.done`)} </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-1 flex-col mt-[16px] ">
          <Label htmlFor="priority" className="text-[14px] font-[400] text-light-gray">Prioridade:</Label>
          <Select name="priority">
            <SelectTrigger className="mt-[6px]">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Prioridade</SelectLabel>
                <SelectItem value="high">{t(`TaskPriority.label.high`)}</SelectItem>
                <SelectItem value="normal">{t(`TaskPriority.label.normal`)}</SelectItem>
                <SelectItem value="low">{t(`TaskPriority.label.low`)} </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between gap-3 mt-[16px]">
        <div className="flex flex-1 flex-col mt-[16px]">
          <Label htmlFor="description" className="text-[14px] font-[400] text-light-gray">Descrição:</Label>
          <Textarea rows={2} name="description" placeholder="Executivo" className="mt-[6px] bg-lighter-gray border-light-gray" />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between gap-3 mt-[16px]">
        <div className="flex flex-1 flex-col mt-[16px] ">
          <Label htmlFor="phone" className="text-[14px] font-[400] text-light-gray">Início (opcional):</Label>
          <Input name="phone" placeholder="(85) 9 98279371" className="mt-[6px] bg-lighter-gray border" type="text" />
        </div>
        <div className="flex flex-1 flex-col mt-[16px]">
          <Label htmlFor="email" className="text-[14px] font-[400] text-light-gray">Fim (opcional):</Label>
          <Input name="email" placeholder="email@email.com" className="mt-[6px] bg-lighter-gray" type="email" />
        </div>
      </div>
    </DialogContent>
  </Dialog>
}