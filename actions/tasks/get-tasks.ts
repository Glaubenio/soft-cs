import {prismadb} from "@/lib/prisma";
import {task_priorities, task_status} from "@prisma/client";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";

export const getTasks = async (priority?: string[], status?: string[], responsibleId?: string[]) => {
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

    const session = await getServerSession(authOptions);
    const current_user = await prismadb.users.findUnique({
        where: {
            id: session?.user?.id,
        }
    });

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
