'use client'
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { AccountForm } from "../forms/Account"



export const AccountsToolbar = () => {
  const [clientFormOpen, setClientFormOpen] = useState(false);

  return <div className="flex flex-row gap-1">
    <AccountForm open={clientFormOpen} setOpen={setClientFormOpen} />

    <Button className="md:py-2 md:px-4 md:h-10 md:rounded-[12px] md:text-sm text-[12px] py-1.5 px-3 h-auto rounded-sm" onClick={() => setClientFormOpen(true)}>
      <PlusCircle /> Nova conta
    </Button>
  </div>
}