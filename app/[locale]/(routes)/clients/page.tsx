import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Session } from "next-auth";

import ClientsView from "./_components/ClientsView";
import SuspenseLoading from "@/components/loadings/suspense";
import { getJourneys } from "@/actions/journeys/get-journeys";
import { getClients } from "@/actions/clients/get-clients";
import { getActiveUsers } from "@/actions/get-users";
import { statuses } from "../invoice/data/data";

export const maxDuration = 300;

const ClientPage = async ({ searchParams }: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) return redirect("/sign-in");

  const journeys = await getJourneys();
  const activeUsers = await getActiveUsers();

  const queryParams = await searchParams;
  const name = (queryParams.name as string) || '';
  const serviceType = (queryParams.serviceType as string)?.split(',').filter((a) => a.length > 0) || [];
  const status = (queryParams.status as string)?.split(',').filter((a) => a.length > 0) || [];
  const responsibleId = (queryParams.responsibleId as string)?.split(',').filter((a) => a.length > 0) || [];
  const clients = await getClients(
    true,
    name,
    serviceType,
    responsibleId,
    status
  );
  const activeTab: string = (queryParams.activeTab as string) || 'list'

  return (
    <div className="flex-1 space-y-4 h-full overflow-scroll">

      <Suspense fallback={<SuspenseLoading />}>
        <ClientsView activeUsers={activeUsers}
          queryParams={queryParams}
          clients={clients}
          activeTab={activeTab}
          filters={{
            status: status,
            serviceType: serviceType,
            responsibleId: responsibleId,
            name: name
          }}
          journeys={journeys} />

      </Suspense>
    </div>
  );
};

export default ClientPage;
