import { prismadb } from "@/lib/prisma";

export const getTasks = async () => {
    return await prismadb.tasks.findMany({
        include: {
            responsible: true
        }
    });
};
