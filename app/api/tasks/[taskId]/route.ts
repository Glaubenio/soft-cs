import {NextResponse} from "next/server";
import {prismadb} from "@/lib/prisma";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";

export async function PUT(req: Request, props: { params: Promise<{ taskId: string }> }) {
    const session = await getServerSession(authOptions);
    const params = await props.params;
    const taskId = params.taskId;

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

        const account = await prismadb.crm_Accounts.findFirst({
            where: {
                id: user?.accountId || "",
            }
        });

        const task = await prismadb.tasks.update({
            where: {
                id: taskId,
            },
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
                client: {
                    connect: {
                        id: clientId,
                    },
                },
                account: {
                    connect: {
                        id: account?.id,
                    },
                },
            }
        });

        return NextResponse.json({data: task}, {status: 200});
    } catch (error) {
        console.log("[UPDATE_TASK]", error);
        return new NextResponse("Initial error", {status: 500});
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ taskId: string }> }) {
    const params = await props.params;
    const taskId = params.taskId;
    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse("Unauthenticated", {status: 401});
    }

    if (!taskId) {
        return new NextResponse("Missing board id", {status: 400});
    }

    try {
        await prismadb.tasks.delete({
            where: {
                id: taskId,
            },
        });

        return NextResponse.json({status: 204});
    } catch (error) {
        return new NextResponse("Initial error", {status: 500});
    }
}