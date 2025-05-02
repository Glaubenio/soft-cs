import React, { Suspense } from "react";
import Container from "../components/ui/Container";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Session } from "next-auth";

import ClientsView from "./_components/ClientsView";
import SuspenseLoading from "@/components/loadings/suspense";

export const maxDuration = 300;

const ProjectsPage = async () => {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) return redirect("/sign-in");

  return (
    <div className="flex-1 space-y-4 h-full overflow-scroll">

      <Suspense fallback={<SuspenseLoading />}>
        <ClientsView />
      </Suspense>
    </div>
  );
};

export default ProjectsPage;
