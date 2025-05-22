import { NextRequest, NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUser } from "@/actions/get-user";
import { task_priorities, task_status } from "@prisma/client";

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams
    let whereClause: any = {};
    console.log("params", params);
    const priority = params.get("priority")?.split(',').filter((a) => a.length > 0) || [];
    const status = params.get("status")?.split(',').filter((a) => a.length > 0) || [];
    const responsibleId = params.get("responsibleId")?.split(',').filter((a) => a.length > 0) || [];
    const clientId = params.get("clientId");
    if (priority.length > 0) {
        whereClause.priority = {
            in: priority as task_priorities[]
        };
    }
    if (status.length > 0) {
        whereClause.status = {
            in: status as task_status[]
        };
    }

    if (responsibleId.length > 0) {
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

    try {
        const tasks = await prismadb.tasks.findMany({
            where: whereClause,
            include: {
                responsible: true
            }
        });

        return NextResponse.json(tasks);
    } catch (error) {
        console.log("[USER_GET]", error);
        return new NextResponse("Initial error", { status: 500 });
    }
}

export async function POST(req: Request) {

    const session = await getServerSession(authOptions);
    const body = await req.json();
    const {
        title,
        content,
        startDate,
        endDate,
        priority,
        status,
        responsibleId,
        clientId
    } = body;

    if (!session) {
        return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!title || !responsibleId || !title || !content) {
        return new NextResponse("Missing one of the task data ", { status: 400 });
    }

    try {
        const user = await prismadb.users.findUnique({
            where: {
                id: session.user.id,
            }
        })

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const task = await prismadb.tasks.create({
            data: {
                title: title,
                content: content,
                startDate: startDate,
                endDate: endDate,
                priority: priority,
                status: status,

                responsible: {
                    connect: {
                        id: responsibleId,
                    },
                },
                account: {
                    connect: {
                        id: user.accountId!,
                    },
                },
                client: {
                    connect: {
                        id: clientId,
                    },
                },
            },
        });

        return NextResponse.json({ data: task }, { status: 201 });
    } catch
    (error) {
        console.log(error);
        return new NextResponse("Initial error", { status: 500 });
    }
}
