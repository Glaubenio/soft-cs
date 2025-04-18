import { Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import React from "react";

type Props = {
  open: boolean;
  title: string;
};

const DashboardMenu = ({ open, title }: Props) => {
  const pathname = usePathname();
  const isPath = pathname.includes("clients");
  return (
    <div className="flex flex-row items-center">
      <Link
        href={"/"}
        className={`flex flex-1 px-[16px] py-[14px] gap-2 p-2 ${isPath ? "bg-[#EBDAFD] rounded-[12px] text-primary" : 'text-[#898FAC]'}`}
      >
        <Users className="w-6" />
        <span className={open ? "" : "hidden"}>{title}</span>
      </Link>
    </div>
  );
};

export default DashboardMenu;
