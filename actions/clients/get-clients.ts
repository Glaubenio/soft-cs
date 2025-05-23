import { prismadb } from "@/lib/prisma";
import { client_service_types, client_statuses } from "@prisma/client";
import { getUser } from "@/actions/get-user";

export const getClients = async (
    includeAssociations: boolean = true,
    name?: string,
    serviceType?: string[],
    csmResponsible?: string[],
    status?: string[]) => {
    let whereClause: any = {};

    if (name && name.length > 0) {
        whereClause.name = {
            contains: name,
            mode: "insensitive"
        };
    }

    if (serviceType && serviceType.length > 0) {
        whereClause.serviceType = {
            in: serviceType as client_service_types[]
        };
    }
    if (status && status.length > 0) {
        whereClause.status = {
            in: status as client_statuses[]
        };
    }

    if (csmResponsible && csmResponsible.length > 0) {
        whereClause.userId = {
            in: csmResponsible
        };
    }

    const current_user = await getUser();

    if (!current_user) {
        throw new Error("User not found");
    }

    whereClause.accountId = current_user.accountId

    return await prismadb.clients.findMany({
        where: whereClause,
        include: {
            tasks: {
                take: 3,
                include: {
                    responsible: includeAssociations,
                }
            },
            csmResponsible: includeAssociations,
            journeyStepsClients: {
                include: {
                    journeyStep: includeAssociations
                }
            }
        }
    });
};
