import {prismadb} from "@/lib/prisma";
import {client_service_types, client_statuses} from "@prisma/client";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";

export const getClients = async (name?: string, serviceType?: string[], csmResponsible?: string[], status?: string[]) => {
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
        whereClause.responsibleId = {
            in: csmResponsible
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

    return await prismadb.clients.findMany({
        where: whereClause,
        include: {
            csmResponsible: true,
            journeyStepsClients: {
                include: {
                    journeyStep: true
                }
            }
        }
    });
};
