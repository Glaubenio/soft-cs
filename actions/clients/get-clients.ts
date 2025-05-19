import { prismadb } from "@/lib/prisma";

export const getClients = async () => {
    return await prismadb.clients.findMany({
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
