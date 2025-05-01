"use client";
import { Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import React from "react";

type Props = {
  open: boolean;
  title: string;
};

const ClientsMenu = ({ open, title }: Props) => {
  const pathname = usePathname();
  const isPath = pathname.includes("clients");
  return (
    <div className={`flex flex-row items-center ${isPath && "mb-7 md:mb-0"}`}>
      <Link
        href={"/clients"}
        className={`text-[10px] md:text-[14px] flex flex-1 flex-col md:flex-row items-center md:items-start px-[16px] py-[14px] gap-2 p-2 ${isPath ? "md:bg-menu-active md:rounded-[12px] text-primary" : 'text-light-gray'}`}
      >
        {
          isPath ?
            <div className="md:hidden flex flex-row items-center justify-center bg-primary rounded-full w-[52px] h-[52px]">
              <Users className="w-[16px] h-[16px] md:w-6 md:h-6 text-[#ffffff]" />
            </div>
            :
            <Users className="md:hidden w-[24px] h-[24px]" />
        }
        <Users className="hidden md:block md:w-6 md:h-6" />

        <span className={open ? "" : "hidden"}>{title}</span>
      </Link>
    </div>
  );
};

export default ClientsMenu;
