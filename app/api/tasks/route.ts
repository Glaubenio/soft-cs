import {NextResponse} from "next/server";
import {prismadb} from "@/lib/prisma";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";

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

        const accountConnect: any = {}
        accountConnect.account = {
            connect: {
                id: user.accountId,
            },
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
                client: {
                    connect: {
                        id: clientId,
                    },
                },
                account: accountConnect.account,
            },
        });

        return NextResponse.json({data: task}, {status: 201});
    } catch
        (error) {
        console.log("[NEW_TASK]", error);
        return new NextResponse("Initial error", {status: 500});
    }
}
