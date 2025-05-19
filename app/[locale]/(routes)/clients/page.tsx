import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Session } from "next-auth";

import ClientsView from "./_components/ClientsView";
import SuspenseLoading from "@/components/loadings/suspense";
import { getJourneys } from "@/actions/journeys/get-journeys";
<<<<<<< HEAD
import { getClients } from "@/actions/clients/get-clients";
import { getActiveUsers } from "@/actions/get-users";
=======
import {getClients} from "@/actions/clients/get-clients";
>>>>>>> 5fb8dd9d2d169dded98b2b3760e2b2f651a956b1

export const maxDuration = 300;

const ClientPage = async ({ searchParams }: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) return redirect("/sign-in");
  const clients = await getClients();
  const journeys = await getJourneys();
  const activeUsers = await getActiveUsers();

  const queryParams = await searchParams;

  const activeTab: string = (queryParams.activeTab as string) || 'list'

  return (
    <div className="flex-1 space-y-4 h-full overflow-scroll">

      <Suspense fallback={<SuspenseLoading />}>
        <ClientsView activeUsers={activeUsers} clients={clients} activeTab={activeTab} journeys={journeys} />
      </Suspense>
    </div>
  );
};

export default ClientPage;
