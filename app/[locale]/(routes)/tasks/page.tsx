import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, useSearchParams } from "next/navigation";
import { Session } from "next-auth";
import TasksView from "./_components/TasksView";
import SuspenseLoading from "@/components/loadings/suspense";
import { getTasks } from "@/actions/tasks/get-tasks";
import { getUser } from "@/actions/get-user";
import { getActiveUsers } from "@/actions/get-users";
import { getClients } from "@/actions/clients/get-clients";

export const maxDuration = 300;

const TasksPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
    const queryParams = await searchParams;
    const priority = (queryParams.priority as string)?.split(',').filter((a) => a.length > 0) || [];
    const status = (queryParams.status as string)?.split(',').filter((a) => a.length > 0) || [];
    const responsibleId = (queryParams.responsibleId as string)?.split(',').filter((a) => a.length > 0) || [];
    const session: Session | null = await getServerSession(authOptions);

    const tasks = await getTasks(priority, status, responsibleId);
    const clients = await getClients(false)
    const activeUsers = await getActiveUsers();

    if (!session) return redirect("/sign-in");


    const activeTab: string = (queryParams.activeTab as string) || 'list'
    return (
        <div className="flex-1 space-y-4 h-full overflow-scroll">

            <Suspense fallback={<SuspenseLoading />}>
                <TasksView
                    filters={{
                        status,
                        priority,
                        responsibleId
                    }}
                    activeTab={activeTab}
                    tasks={tasks}
                    clients={clients}
                    activeUsers={activeUsers} />
            </Suspense>
        </div>
    );
};

export default TasksPage;
