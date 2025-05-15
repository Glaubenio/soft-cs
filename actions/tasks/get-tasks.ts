import {prismadb} from "@/lib/prisma";

export const getTasks = async (status: string, priority: string, responsibleId: string) => {
    const whereClause: any = {}

    if (status) {
        whereClause.status = status;
    }
    if (priority) {
        whereClause.priority = priority;
    }
    if (responsibleId) {
        whereClause.responsibleId = responsibleId
    }

    return await prismadb.tasks.findMany({
        where: whereClause,
        include: {
            responsible: true
        }
    });
};
