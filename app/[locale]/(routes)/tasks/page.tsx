import React, { Suspense } from "react";
import Container from "../components/ui/Container";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Session } from "next-auth";

import TasksView from "./_components/TasksView";
import SuspenseLoading from "@/components/loadings/suspense";
import { getTasks } from "@/actions/tasks/get-tasks";
import { getUser } from "@/actions/get-user";
import { getActiveUsers } from "@/actions/get-users";
import { TasksContext } from "./tasks-context";



export const maxDuration = 300;

const ProjectsPage = async () => {
    const session: Session | null = await getServerSession(authOptions);
    const tasks = await getTasks();
    const user = await getUser();
    const activeUsers = await getActiveUsers();

    console.log(user, "user");
    console.log(tasks, "tasks");

    if (!session) return redirect("/sign-in");

    return (
        <div className="flex-1 space-y-4 h-full overflow-scroll">

            <Suspense fallback={<SuspenseLoading />}>
                <TasksView tasks={tasks} activeUsers={activeUsers} />
            </Suspense>
        </div>
    );
};

export default ProjectsPage;
