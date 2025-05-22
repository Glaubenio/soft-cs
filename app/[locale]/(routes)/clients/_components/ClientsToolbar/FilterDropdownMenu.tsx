
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuLabel,
  DropdownMenuTrigger, DropdownMenuSeparator,
  DropdownMenuGroup, DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ReactNode, useContext, useState } from "react";
import { ClientsContext } from "../../clients-context";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/types/types";

export const FilterDropdownMenu = ({ triggerButton }: { triggerButton: ReactNode }) => {
  const router = useRouter()
  const { activeUsers, handleSelectedFilter, currentFilters } = useContext(ClientsContext)


  const t = useTranslations()


  const { status, serviceType, responsibleId } = currentFilters
  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      {triggerButton}
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel>Tipo de atendimento</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <div className="flex items-center gap-2 px-2">
          <Checkbox
            defaultChecked={serviceType.includes("HIGH")}
            onCheckedChange={() => handleSelectedFilter("serviceType", "HIGH")}
          />
          {t('ClientServiceType.HIGH')}
        </div>
        <div className="flex items-center gap-2 px-2">
          <Checkbox
            defaultChecked={serviceType.includes("LOW")}
            onCheckedChange={() => handleSelectedFilter("serviceType", "LOW")}
          />
          {t('ClientServiceType.LOW')}
        </div>
        <div className="flex items-center gap-2 px-2">
          <Checkbox
            defaultChecked={serviceType.includes("TECH")}

            onCheckedChange={() => handleSelectedFilter("serviceType", "TECH")}
          />
          {t('ClientServiceType.TECH')}
        </div>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuLabel>CSM Responsável</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        {activeUsers.map((user: User) => <div key={user.id} className="flex items-center gap-2 px-2">
          <Checkbox
            defaultChecked={responsibleId.includes(user.id)}
            onCheckedChange={() => handleSelectedFilter("responsibleId", user.id)}
          />{user.name}
        </div>
        )
        }
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuLabel>Status</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <div className="flex items-center gap-2 px-2">
          <Checkbox
            defaultChecked={status.includes("ACTIVE")}
            onCheckedChange={() => handleSelectedFilter("status", "ACTIVE")}
          />
          {t('ClientStatus.label.ACTIVE')}
        </div>
        <div className="flex items-center gap-2 px-2">
          <Checkbox
            defaultChecked={status.includes("INACTIVE")}
            onCheckedChange={() => handleSelectedFilter("status", "INACTIVE")}
          />
          {t('ClientStatus.label.INACTIVE')}
        </div>
        <div className="flex items-center gap-2 px-2">
          <Checkbox
            defaultChecked={status.includes("IN_IMPLANTATION")}
            onCheckedChange={() => handleSelectedFilter("status", "IN_IMPLANTATION")} />
          {t('ClientStatus.label.IN_IMPLANTATION')}
        </div>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
}