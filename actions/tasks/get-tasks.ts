import { prismadb } from "@/lib/prisma";
import { task_priorities, task_status } from "@prisma/client";
import { getUser } from "@/actions/get-user";

export const getTasks = async (clientId?: string, priority?: string[], status?: string[], responsibleId?: string[]) => {
    let whereClause: any = {};

    if (priority && priority.length > 0) {
        whereClause.priority = {
            in: priority as task_priorities[]
        };
    }
    if (status && status.length > 0) {
        whereClause.status = {
            in: status as task_status[]
        };
    }

    if (responsibleId && responsibleId.length > 0) {
        whereClause.responsibleId = {
            in: responsibleId
        };
    }
    if (clientId) {
        whereClause.clientId = clientId;
    }

    const current_user = await getUser();

    if (!current_user) {
        throw new Error("User not found");
    }

    whereClause.accountId = current_user.accountId

    return await prismadb.tasks.findMany({
        where: whereClause,
        include: {
            responsible: true
        }
    });
};
