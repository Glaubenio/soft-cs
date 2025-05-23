import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";
import { getUser } from "@/actions/get-user";
import { newUserNotify } from "@/lib/new-user-notify";

export async function GET(req: Request, props: { params: Promise<{ userId: string }> }) {
    const params = await props.params;
    const currentUser = await getUser()

    if (!currentUser) {
        return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!currentUser.is_admin) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    try {
        const user = await prismadb.users.findFirst({
            where: {
                id: params.userId,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.log("[USER_GET]", error);
        return new NextResponse("Initial error", { status: 500 });
    }
}

export async function PUT(req: Request, props: { params: Promise<{ userId: string }> }) {
    const params = await props.params;
    const currentUser = await getUser()

    if (!currentUser) {
        return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!currentUser.is_admin) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    try {
        const body = await req.json();
        const {
            name,
            username,
            email,
            jobTitle,
            accountId
        } = body;

        if (!name || !email || !accountId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (await prismadb.users.findFirst({ where: { email: email, NOT: { id: params.userId } } })) {
            return new NextResponse("User already exist", { status: 401 });
        }

        if (await prismadb.crm_Contracts.findFirst({ where: { id: accountId } })) {
            return new NextResponse("Account does not exists", { status: 400 });
        }

        const user = await prismadb.users.update({
            where: {
                id: params.userId,
            },
            data: {
                name,
                username,
                email,
                jobTitle,
                account: {
                    connect: {
                        id: accountId,
                    },
                }
            },
        });

        newUserNotify(user);

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.log("[USERS_POST]", error);
        return new NextResponse("Initial error", { status: 500 });
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ userId: string }> }) {
    const params = await props.params;
    const currentUser = await getUser()

    if (!currentUser) {
        return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!currentUser.is_admin) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    try {
        const user = await prismadb.users.delete({
            where: {
                id: params.userId,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.log("[USER_DELETE]", error);
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
