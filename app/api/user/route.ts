import {NextResponse} from "next/server";
import {prismadb} from "@/lib/prisma";
import {hash} from "bcryptjs";
import {newUserNotify} from "@/lib/new-user-notify";
import {getUser} from "@/actions/get-user";

export async function POST(req: Request) {
    const currentUser = await getUser()

    if (!currentUser) {
        return new NextResponse("Unauthenticated", {status: 401});
    }

    if (!currentUser.is_admin) {
        return new NextResponse("Unauthorized", {status: 403});
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
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if (await prismadb.users.findFirst({where: {email: email}})) {
            return new NextResponse("User already exist", {status: 401});
        }

        if (await prismadb.crm_Contracts.findFirst({where: {id: accountId}})) {
            return new NextResponse("Account does not exists", {status: 400});
        }

        const password = Math.random().toString(36).slice(-8);

        const user = await prismadb.users.create({
            data: {
                name,
                username,
                avatar: "",
                email,
                jobTitle,
                userLanguage: "pt_br",
                userStatus: "ACTIVE",
                password: await hash("@" + password, 12),
                account: {
                    connect: {
                        id: accountId,
                    },
                }
            },
        });

        newUserNotify(user);

        return NextResponse.json(user, {status: 201});
    } catch (error) {
        console.log("[USERS_POST]", error);
        return new NextResponse("Initial error", {status: 500});
    }
}

export async function GET() {
    const currentUser = await getUser()

    if (!currentUser) {
        return new NextResponse("Unauthenticated", {status: 401});
    }

    if (!currentUser.is_admin) {
        return new NextResponse("Unauthorized", {status: 403});
    }

    try {
        const users = await prismadb.users.findMany();

        return NextResponse.json(users);
    } catch (error) {
        console.log("[USERS_GET]", error);
        return new NextResponse("Initial error", {status: 500});
    }
}
