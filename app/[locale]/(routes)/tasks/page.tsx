import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, useSearchParams } from "next/navigation";
import { Session } from "next-auth";
import TasksView from "./_components/TasksView";
import SuspenseLoading from "@/components/loadings/suspense";
import { getTasks } from "@/actions/tasks/get-tasks";
import { getActiveUsers } from "@/actions/get-users";
import { getClients } from "@/actions/clients/get-clients";

export const maxDuration = 300;

export const TasksPage = async ({
    params: { clientId },
}: {
    params: { clientId?: string };
}) => {
    const session: Session | null = await getServerSession(authOptions);
    const clients = await getClients(false)
    const activeUsers = await getActiveUsers();

    if (!session) return redirect("/sign-in");

    return (
        <div className="flex-1 space-y-4 h-full overflow-scroll">

            <Suspense fallback={<SuspenseLoading />}>
                <TasksView
                    clientId={clientId}
                    clients={clients}
                    activeUsers={activeUsers} />
            </Suspense>
        </div>
    );
};

export default TasksPage;
