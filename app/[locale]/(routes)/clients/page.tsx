import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Session } from "next-auth";

import ClientsView from "./_components/ClientsView";
import SuspenseLoading from "@/components/loadings/suspense";
import { getJourneys } from "@/actions/journeys/get-journeys";
import {getClients} from "@/actions/clients/get-clients";

export const maxDuration = 300;

const ClientPage = async () => {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) return redirect("/sign-in");
  const journeys = await getJourneys();
  const clients = await getClients();
  console.log("Clients", clients);
  return (
    <div className="flex-1 space-y-4 h-full overflow-scroll">

      <Suspense fallback={<SuspenseLoading />}>
        <ClientsView journeys={journeys} />
      </Suspense>
    </div>
  );
};

export default ClientPage;
