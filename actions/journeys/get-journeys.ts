import { prismadb } from "@/lib/prisma";
import { getUser } from "../get-user";


export const getJourneys = async () => {
    const user = await getUser();
    const accountId = user.accountId;
    if (!accountId) {
        throw new Error("Account ID is required");
    }

    const whereClause: any = {}

    if (accountId) {
        whereClause.accountId = accountId;
    }

    return await prismadb.journeys.findMany({
        where: whereClause,
        include: {
            journeySteps: true
        },
    });
};
