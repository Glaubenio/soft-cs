import { prismadb } from "@/lib/prisma";

export const getClients = async () => {
    return await prismadb.clients.findMany({
        include: {
            csmResponsible: {
                select: {
                    name: true,
                },
            }, clientContacts: {
                select: {
                    id: true,
                    name: true,
                    jobTitle: true,
                    email: true,
                    phoneNumber: true
                }
            }
        }
    });
};
