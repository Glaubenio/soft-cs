import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import SuspenseLoading from "@/components/loadings/suspense";
import { getAccounts } from "@/actions/crm/get-accounts";
import AccountsView from "./_components/AccountsView";

export const maxDuration = 300;

export const AccountsPage = async ({
    params: { clientId },
    searchParams,
}: {
    params: { clientId?: string };
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
    const session: Session | null = await getServerSession(authOptions);


    if (!session) return redirect("/sign-in");

    const user = session?.user;
    if (!user.isAdmin) {
        return redirect("/");
    }
    const accounts = await getAccounts();

    return (
        <div className="flex-1 space-y-4 h-full overflow-scroll">

            <Suspense fallback={<SuspenseLoading />}>
                <AccountsView
                    accounts={accounts} />
            </Suspense>
        </div>
    );
};

export default AccountsPage;
