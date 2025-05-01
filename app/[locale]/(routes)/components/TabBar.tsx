
import { getServerSession } from "next-auth";

import { getDictionary } from "@/dictionaries";
import { authOptions } from "@/lib/auth";
import DashboardMenu from "./menu-items/Dashboard";
import DocumentsModuleMenu from "./menu-items/Documents";
import EmailsModuleMenu from "./menu-items/Emails";
import TasksModuleMenu from "./menu-items/Tasks";
import ClientsModuleMenu from "./menu-items/Clients";

const TabBar = async () => {
  const session = await getServerSession(authOptions);

  if (!session) return null;

  //Get user language
  const lang = session.user.userLanguage;

  //Fetch translations from dictionary
  const dict = await getDictionary(lang as "pt_br" | "cz" | "de");

  if (!dict) return null;

  if (!dict) return null;
  return <div className="absolute md:hidden bottom-0 left-0 w-full h-[87px] bg-white shadow-[0px -6px 50px -32px rgba(94, 23, 235, 0.08)] flex items-center justify-center">
    <ClientsModuleMenu open={true} title={dict.ModuleMenu.clients} />
    <TasksModuleMenu open={true} title={dict.ModuleMenu.projects} />
    <DashboardMenu open={true} title={dict.ModuleMenu.dashboard} />
    <DocumentsModuleMenu
      open={true}
      title={dict.ModuleMenu.documents}
    />
    <EmailsModuleMenu open={true} title={dict.ModuleMenu.emails} />

  </div>
}

export default TabBar;