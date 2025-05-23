"use client";

import React, { useEffect, useState } from "react";
import DocumentsModuleMenu from "./menu-items/Documents";
import DashboardMenu from "./menu-items/Dashboard";
import EmailsModuleMenu from "./menu-items/Emails";
import TasksModuleMenu from "./menu-items/Tasks";
import ClientsModuleMenu from "./menu-items/Clients";
import { ArrowRightToLine } from "lucide-react";

type Props = {
  modules: any;
  dict: any;
  build: number;
};

const ModuleMenu = ({ modules, dict, build }: Props) => {
  const [open, setOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col ">
      <div
        className={` ${open ? "w-[250]" : "w-[164px] "
          }  h-screen relative duration-300 px-[32px] py-[24px] hidden md:block`}
      >
        <div className="bg-white rounded-[20px] h-full p-[24px] shadow-[0px -6px 50px -32px rgba(94, 23, 235, 0.08)]">
          <div className="flex gap-x-4 items-center">
            <h1
              className={` origin-left font-medium text-xl duration-200 ${!open && "scale-0"
                }`}
            >
              <img src="/images/logo_small.svg" />
            </h1>
            <div
              className={`cursor-pointer duration-500 border rounded-full px-2 py-2 bg-primary text-white ${open && "rotate-[180deg]"
                }`}
              onClick={() => setOpen(!open)}
            >
              <ArrowRightToLine className="h-[15px]" />
            </div>

          </div>
          <hr className="mt-[20px]" />
          <div className="mt-[20px] justify-center">
            <DashboardMenu open={open} title={dict.ModuleMenu.dashboard} />
            <ClientsModuleMenu open={open} title={dict.ModuleMenu.clients} />
            <TasksModuleMenu open={open} title={dict.ModuleMenu.projects} />
            {/* <DocumentsModuleMenu
              open={open}
              title={dict.ModuleMenu.documents}
            />
            <EmailsModuleMenu open={open} title={dict.ModuleMenu.emails} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleMenu;
