import {NextResponse} from "next/server";
import {prismadb} from "@/lib/prisma";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {getUser} from "@/actions/get-user";
import {task_priorities, task_status} from "@prisma/client";

export async function GET(props: {
    params: Promise<{
        clientId?: string,
        priority?: string[],
        status?: string[],
        responsibleId?: string[]
    }>
}) {

    const params = await props.params;
    let whereClause: any = {};

    if (params.priority && params.priority.length > 0) {
        whereClause.priority = {
            in: params.priority as task_priorities[]
        };
    }
    if (params.status && params.status.length > 0) {
        whereClause.status = {
            in: params.status as task_status[]
        };
    }

    if (params.responsibleId && params.responsibleId.length > 0) {
        whereClause.responsibleId = {
            in: params.responsibleId
        };
    }
    if (params.clientId) {
        whereClause.clientId = params.clientId;
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
        return new NextResponse("Initial error", {status: 500});
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
        return new NextResponse("Unauthenticated", {status: 401});
    }

    if (!title || !responsibleId || !title || !content) {
        return new NextResponse("Missing one of the task data ", {status: 400});
    }

    try {
        const user = await prismadb.users.findUnique({
            where: {
                id: session.user.id,
            }
        })

        if (!user) {
            return new NextResponse("User not found", {status: 404});
        }

        const task = await prismadb.tasks.create({
            data: {
                title: title,
                content: content,
                startDate: startDate,
                endDate: endDate,
                priority: priority,
                status: status,
                clientId: clientId,
                responsible: {
                    connect: {
                        id: responsibleId,
                    },
                },
                account: {
                    connect: {
                        id: user.accountId!,
                    },
                }
            },
        });

        return NextResponse.json({data: task}, {status: 201});
    } catch
        (error) {
        console.log(error);
        return new NextResponse("Initial error", {status: 500});
    }
}
