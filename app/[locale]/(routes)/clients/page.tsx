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

  const activeUsers = await getActiveUsers();

  return (
    <div className="flex-1 space-y-4 h-full overflow-scroll">

      <Suspense fallback={<SuspenseLoading />}>
        <ClientsView activeUsers={activeUsers}
        />

      </Suspense>
    </div>
  );
};

export default ClientPage;
