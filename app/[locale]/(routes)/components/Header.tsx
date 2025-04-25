"use client";
import FulltextSearch from "./FulltextSearch";
import AvatarDropdown from "./ui/AvatarDropdown";

import { Separator } from "@/components/ui/separator";

import NotificationsComponent from "@/components/notifications";
import { usePathname } from "next/navigation";

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
        breadcrumb: 'Páginas / Dashboard',
      };
    }

    if (pathname.includes('profile')) {
      return {
        title: "Perfil",
        breadcrumb: 'Páginas / Perfil',
      }
    }
    return { title: undefined, breadcrumb: undefined }
  };
  const { title, breadcrumb } = getBreadcrumbAndTitle()!
  return (
    <div className="flex  h-20 justify-between items-center pr-[32px] space-x-5 mt-[24px]">
      <div className="flex flex-col">
        <div className="text-[12px] text-light-gray font-[400]">{breadcrumb}</div>
        <div className="text-[28px] font-[700]">{title}</div>
      </div>
      <div className="flex items-center gap-3 bg-white rounded-[18px] px-[14px] py-[4px]">
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
