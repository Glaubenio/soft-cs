'use client';
import { Grid2X2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  open: boolean;
  title: string;
};

const DashboardMenu = ({ open, title }: Props) => {
  const pathname = usePathname();
  const locale = usePathname()?.split("/")[1];


  const isPath = pathname.endsWith(locale);
  return (
    <div className={`flex flex-row items-center ${isPath && "mb-7 md:mb-0"}`}>
      <Link
        href={"/"}
        className={`text-[10px] md:text-[14px] flex flex-1 flex-col md:flex-row items-center md:items-start px-[16px] py-[14px] gap-2 p-2 ${isPath ? "md:bg-menu-active md:rounded-[12px] text-primary" : 'text-light-gray'}`}
      >
        {
          isPath ?
            <div className="md:hidden flex flex-row items-center justify-center bg-primary rounded-full w-[52px] h-[52px]">
              <Grid2X2 className="w-[16px] h-[16px] md:w-6 md:h-6 text-[#ffffff]" />
            </div>
            :
            <Grid2X2 className="md:hidden size-[24px]" />
        }
        <Grid2X2 className="hidden md:block md:w-6 md:h-6" />

        <span className={open ? "" : "hidden"}>{title}</span>
      </Link>
    </div>
  );
};

export default DashboardMenu;
