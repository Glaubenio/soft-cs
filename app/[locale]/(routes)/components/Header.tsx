"use client";
import FulltextSearch from "./FulltextSearch";
import AvatarDropdown from "./ui/AvatarDropdown";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import NotificationsComponent from "@/components/notifications";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlignRight, Bell, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
type Props = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  lang: string;
  isAdmin: boolean;
};

const Header = ({ id, name, email, avatar, isAdmin }: Props) => {
  const pathname = usePathname();
  const getBreadcrumbAndTitle = (): { title: string | undefined, breadcrumb: string | undefined } => {
    if (pathname.split('/').length == 2) {
      return {
        title: "Dashboard",
        breadcrumb: 'Páginas/ Dashboard',
      };
    }

    if (pathname.includes('profile')) {
      return {
        title: "Perfil",
        breadcrumb: 'Páginas/ Perfil',
      }
    }

    if (pathname.includes('clients')) {
      return {
        title: "Clientes",
        breadcrumb: 'Páginas/ Clientes',
      }
    }
    return { title: undefined, breadcrumb: undefined }
  };
  const { title, breadcrumb } = getBreadcrumbAndTitle()!
  return (
    <div className="flex flex-col md:flex-row h-20 justify-between md:items-center pr-0 md:pr-[32px] space-x-5 mt-[24px]">
      <div className="flex md:hidden items-center gap-3 bg-white rounded-[18px] px-[14px] py-[10px]">
        <FulltextSearch />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 ml-[16px]">
              <AlignRight className="h-[24px] w-[24px]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-[14px] font-[500]">
                <Bell className="mr-1 h-[24px] w-[24px]" /> Notificações
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()} className="text-[14px] font-[500]">
                <LogOut className="mr-1 h-[24px] w-[24px]" /> Sair
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col mt-[12px] md:mt-0">
        <div className="text-[10px] md:text-[10px] text-light-gray font-[400]">{breadcrumb}</div>
        <div className="text-[20px] md:text-[28px] font-[700]">{title}</div>
      </div>
      <div className="hidden md:flex items-center gap-3 bg-white rounded-[18px] px-[14px] py-[4px]">
        <FulltextSearch />
        <NotificationsComponent />
        <AvatarDropdown
          avatar={avatar}
          userId={id}
          isAdmin={isAdmin}
          name={name}
          email={email}
        />
      </div>
    </div>
  );
};

export default Header;
