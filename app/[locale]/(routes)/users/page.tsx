import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import SuspenseLoading from "@/components/loadings/suspense";
import { getUsers } from "@/actions/get-users";
import UsersView from "./_components/UsersView";

export const maxDuration = 300;

export const UsersPage = async () => {
    const session: Session | null = await getServerSession(authOptions);

    if (!session) return redirect("/sign-in");
    const user = session?.user;
    if (!user.isAdmin) {
        return redirect("/");
    }
    const Users = await getUsers();

    return (
        <div className="flex-1 space-y-4 h-full overflow-scroll">

            <Suspense fallback={<SuspenseLoading />}>
                <UsersView
                    users={Users} />
            </Suspense>
        </div>
    );
};

export default UsersPage;
