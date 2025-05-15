import { prismadb } from "@/lib/prisma";
import { task_priorities, task_status } from "@prisma/client";

export const getTasks = async (priority?: string[], status?: string[], responsibleId: string[]) => {
    let whereClause: any = {
    };
    if (priority && priority.length > 0) {
        console.log(priority, "priority");
        whereClause.priority = {
            in: priority as task_priorities[]
        };
    }
    if (status && status.length > 0) {
        console.log(status, "status");
        whereClause.status = {
            in: status as task_status[]
        };
    }

    if (responsibleId && responsibleId.length > 0) {
        whereClause.responsibleId = {
            in: responsibleId
        };
    }
    return await prismadb.tasks.findMany({
        where: whereClause,
        include: {
            responsible: true
        }
    });
};
