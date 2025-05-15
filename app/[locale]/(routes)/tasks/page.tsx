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

export const maxDuration = 300;

const ProjectsPage = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined }
}) => {
    const queryParams = await searchParams;
    const priority = queryParams.priority?.split(',').filter((a) => a.length > 0) || [];
    const status = queryParams.status?.split(',').filter((a) => a.length > 0) || [];
    const responsibleId = queryParams.responsibleId?.split(',').filter((a) => a.length > 0) || [];
    const session: Session | null = await getServerSession(authOptions);

    const tasks = await getTasks(priority, status, responsibleId);
    const user = await getUser();
    const activeUsers = await getActiveUsers();

    console.log(user, "user");
    console.log(tasks, "tasks");

    if (!session) return redirect("/sign-in");


    const activeTab: string = queryParams.activeTab || 'list'
    return (
        <div className="flex-1 space-y-4 h-full overflow-scroll">

            <Suspense fallback={<SuspenseLoading />}>
                <TasksView
                    activeTab={activeTab}
                    tasks={tasks}
                    activeUsers={activeUsers} />
            </Suspense>
        </div>
    );
};

export default ProjectsPage;
