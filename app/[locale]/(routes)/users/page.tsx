import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import SuspenseLoading from "@/components/loadings/suspense";
import UsersView from "./_components/UsersView";
import { getAccounts } from "@/actions/crm/get-accounts";

export const maxDuration = 300;

const UsersPage = async () => {
    const session: Session | null = await getServerSession(authOptions);

    if (!session) return redirect("/sign-in");
    const user = session?.user;
    if (!user.isAdmin) {
        return redirect("/");
    }

    const accounts = await getAccounts()

    return (
        <div className="flex-1 space-y-4 h-full overflow-scroll">

            <Suspense fallback={<SuspenseLoading />}>
                <UsersView accounts={accounts} />
            </Suspense>
        </div>
    );
};

export default UsersPage;
