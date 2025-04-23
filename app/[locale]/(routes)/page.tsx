import { Suspense } from "react";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import {
  Banknote,
  ChartBar,
  Expand,
  PiggyBank,
  Repeat,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { getDictionary } from "@/dictionaries";
import LoadingBox from "./components/dashboard/loading-box";
import {
  getTasksCount,
  getUsersTasksCount,
} from "@/actions/dashboard/get-tasks-count";
import { getModules } from "@/actions/get-modules";
import { getEmployees } from "@/actions/get-empoloyees";
import { getLeadsCount } from "@/actions/dashboard/get-leads-count";
import { getBoardsCount } from "@/actions/dashboard/get-boards-count";
import { getStorageSize } from "@/actions/documents/get-storage-size";
import { getContactCount } from "@/actions/dashboard/get-contacts-count";
import { getAccountsCount } from "@/actions/dashboard/get-accounts-count";
import { getContractsCount } from "@/actions/dashboard/get-contracts-count";
import { getInvoicesCount } from "@/actions/dashboard/get-invoices-count";
import { getDocumentsCount } from "@/actions/dashboard/get-documents-count";
import { getActiveUsersCount } from "@/actions/dashboard/get-active-users-count";
import { getOpportunitiesCount } from "@/actions/dashboard/get-opportunities-count";
import { getExpectedRevenue } from "@/actions/crm/opportunity/get-expected-revenue";
import MetricCard from "./components/dashboard/metric-card";
import ClientsTable from "./components/dashboard/clients-table";
import { AreaChart, BarChart } from "@tremor/react";
const fakeAreaChartData = [
  {
    month: "Jan",
    churn: 0.5,
  },
  {
    month: "Fev",
    churn: 0.4,
  },
  {
    month: "Mar",
    churn: 0.3,
  },
  {
    month: "Abr",
    churn: 0.2,
  },
  {
    month: "Mai",
    churn: 0.1,
  },
  {
    month: "Jun",
    churn: 0.2,
  },
  {
    month: "Jul",
    churn: 0.3,
  },
  {
    month: "Ago",
    churn: 0.4,
  },
  {
    month: "Set",
    churn: 0.5,
  },
  {
    month: "Out",
    churn: 0.6,
  },
  {
    month: "Nov",
    churn: 0.7,
  },
  {
    month: "Dez",
    churn: 0.8,
  },
]
const churnData = [
  {
    date: "Jan",
    "Usuários": 5000,
  },
  {
    date: "Fev",
    "Usuários": -1200,
  },
  {
    date: "Mar",
    "Usuários": 3500,
  },
  {
    date: "Abr",
    "Usuários": 2200,
  },
  {
    date: "Mai",
    "Usuários": -450,
  },
  {
    date: "Jun",
    "Usuários": 1750,
  },
]

const retentionData = [
  {
    date: "Jan",
    "Churn (R$)": 5000,
  },
  {
    date: "Fev",
    "Churn (R$)": 1200,
  },
  {
    date: "Mar",
    "Churn (R$)": 3500,
  },
  {
    date: "Abr",
    "Churn (R$)": 2200,
  },
  {
    date: "Mai",
    "Churn (R$)": 450,
  },
  {
    date: "Jun",
    "Churn (R$)": 1750,
  },
]


const DashboardPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) return null;

  const userId = session?.user?.id;

  //Get user language
  const lang = session?.user?.userLanguage;

  //Fetch translations from dictionary
  const dict = await getDictionary(lang as "pt_br" | "cz" | "de" | "uk"); //Fetch data for dashboard

  const modules = await getModules();
  const leads = await getLeadsCount();
  const tasks = await getTasksCount();
  const employees = await getEmployees();
  const storage = await getStorageSize();
  const projects = await getBoardsCount();
  const contacts = await getContactCount();
  const contracts = await getContractsCount();
  const users = await getActiveUsersCount();
  const accounts = await getAccountsCount();
  const invoices = await getInvoicesCount();
  const revenue = await getExpectedRevenue();
  const documents = await getDocumentsCount();
  const opportunities = await getOpportunitiesCount();
  const usersTasks = await getUsersTasksCount(userId);

  //Find which modules are enabled
  const crmModule = modules.find((module) => module.name === "crm");
  const invoiceModule = modules.find((module) => module.name === "invoice");
  const projectsModule = modules.find((module) => module.name === "projects");
  const documentsModule = modules.find((module) => module.name === "documents");
  const employeesModule = modules.find((module) => module.name === "employees");
  const secondBrainModule = modules.find(
    (module) => module.name === "secondBrain"
  );


  const valueFormatter = (value: number) => {
    return Intl.NumberFormat("us").format(value).toString();
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-cols-subgrid col-span-3">
          <Suspense fallback={<LoadingBox />}>
            <MetricCard title="Taxa de churn" metricValue="10,5%" icon={<TrendingUp className="text-primary" />} />
          </Suspense>
          <Suspense fallback={<LoadingBox />}>
            <MetricCard title="Retenção Média" metricValue="13 meses" icon={<Repeat className="text-primary" />} />
          </Suspense>
          <Suspense fallback={<LoadingBox />}>
            <MetricCard title="Churn em Valor" metricValue="-18k" icon={<Banknote className="text-primary" />} />
          </Suspense>
          <Suspense fallback={<LoadingBox />}>
            <MetricCard title="MRR Total" metricValue="R$ 180K" icon={<PiggyBank className="text-primary" />} />
          </Suspense>
          <Suspense fallback={<LoadingBox />}>
            <MetricCard title="Valor de Expansão" metricValue="R$ 32K" icon={<Expand className="text-primary" />} />
          </Suspense>
          <Suspense fallback={<LoadingBox />}>
            <MetricCard title="Retenção Líquida (NRR)" metricValue="115%" icon={<ChartBar className="text-primary" />} />
          </Suspense>
        </div>
        <div className="grid col-span-2">
          <ClientsTable />
        </div>
      </div >
      <div className="grid text-light-gray text-[20px] font-[700]">
        Retenção e Churn
      </div>
      <div className="grid gap-4 grid-cols-4">
        <div className="grid gap-4 grid-cols-1 col-span-2 bg-white rounded-[20px] p-[14px] blur-sm">
          <div className="grid grid-rows-subgrid grid-cols-3 flex gap-4">
            <div className="flex flex-col bg-white shadow-soft-cs px-[14px] py-[12px] backdrop-blur-soft-cs rounded-[12px] text-[12px] font-[400] text-light-gray">
              Taxa de churn
              <div className="flex flex-row text-[24px] font-[700] text-foreground items-baseline">
                4,5%
              </div>
            </div>
            <div className="flex flex-col bg-white shadow-soft-cs px-[14px] py-[12px] backdrop-blur-soft-cs rounded-[12px] text-[12px] font-[400] text-light-gray">
              Clientes ativos
              <div className="flex flex-row text-[24px] font-[700] text-foreground items-baseline">
                250
                <div className="flex gap-1 bg-light-green text-dot-green h-fit px-[8px] py-[3px] ml-[4px] rounded-full text-[10px] font-[700]">
                  <TrendingUp className="h-[12px] w-[12px]" />+ 45
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-white shadow-soft-cs px-[14px] py-[12px] backdrop-blur-soft-cs rounded-[12px] text-[12px] font-[400] text-light-gray">
              Clientes perdidos
              <div className="flex flex-row text-[24px] font-[700] text-foreground items-baseline">
                15
                <div className="flex gap-1 bg-light-red text-dot-red h-fit px-[8px] py-[3px] ml-[4px] rounded-full text-[10px] font-[700]">
                  <TrendingDown className="h-[12px] w-[12px]" />- 3
                </div>
              </div>
            </div>
          </div>
          <AreaChart
            data={fakeAreaChartData}
            index="month"
            colors={["primary"]}
            showLegend={false}
            categories={["churn"]} />
        </div>
        <div className="grid gap-4 col-span-1 bg-white rounded-[20px] p-[14px] blur-sm">
          <div className="flex flex-col text-[12px] font-[400] text-light-gray">
            Churn em valor
            <div className="flex flex-row text-[28px] font-[700] text-foreground items-baseline">
              - 10k
              <div className="flex gap-1 bg-light-red text-dot-red h-fit px-[8px] py-[3px] ml-[4px] rounded-full text-[10px] font-[700]">
                <TrendingDown className="h-[12px] w-[12px]" />- 2500
              </div>
            </div>
          </div>
          <BarChart
            className="h-72"
            data={retentionData}
            index="date"
            showLegend={false}
            colors={["primary"]}
            categories={["Churn (R$)"]}

          />
        </div>
        <div className="grid gap-4 col-span-1 bg-white rounded-[20px] p-[14px] blur-sm">
          <div className="flex flex-col text-[12px] font-[400] text-light-gray">
            Retenção média
            <div className="flex flex-row text-[28px] font-[700] text-foreground items-baseline">
              3 meses
              <div className="flex gap-1 bg-light-red text-dot-red h-fit px-[8px] py-[3px] ml-[4px] rounded-full text-[10px] font-[700]">
                <TrendingDown className="h-[12px] w-[12px]" />- 1 mês
              </div>
            </div>
          </div>
          <BarChart
            className="h-72"
            data={churnData}
            index="date"
            showLegend={false}
            colors={["primary"]}
            categories={["Usuários"]}

          />
        </div>
      </div>
    </div >
  );
};



export default DashboardPage;