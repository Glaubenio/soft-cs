'use client'
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { UserForm } from "../forms/User"



export const UsersToolbar = () => {
  const [clientFormOpen, setClientFormOpen] = useState(false);

  return <div className="flex flex-row gap-1">
    <UserForm open={clientFormOpen} setOpen={setClientFormOpen} />

    <Button className="md:py-2 md:px-4 md:h-10 md:rounded-[12px] md:text-sm text-[12px] py-1.5 px-3 h-auto rounded-sm" onClick={() => setClientFormOpen(true)}>
      <PlusCircle /> Novo usuário
    </Button>
  </div>
}