import {prismadb} from "@/lib/prisma";


export const getJourneys = async (accountId: String) => {
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
