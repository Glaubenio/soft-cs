import {prismadb} from "@/lib/prisma";

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
            }, tasks: {
                select: {
                    id: true,
                    title: true,
                    content: true,
                    status: true,
                    priority: true,
                    createdAt: true,
                    updatedAt: true,
                    dueDate: true,
                    priority: true,
                    clientId: true,
                    assigned_user: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    });
};
