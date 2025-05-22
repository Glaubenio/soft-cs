import {NextResponse} from "next/server";
import {prismadb} from "@/lib/prisma";
import {getUser} from "@/actions/get-user";

export async function POST(req: Request) {
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
            email,
            cnpj,
            segment,
            size
        } = body;

        const newAccount = await prismadb.crm_Accounts.create({
            data: {
                name,
                email,
                cnpj,
                segment,
                size
            },
        });

        return NextResponse.json({newAccount}, {status: 200});
    } catch (error) {
        console.log("[NEW_ACCOUNT_POST]", error);
        return new NextResponse("Initial error", {status: 500});
    }
}

export async function GET() {
    const currentUser = await getUser()

    if (!currentUser) {
        return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!currentUser.is_admin) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    try {
        const accounts = await prismadb.crm_Accounts.findMany({});

        return NextResponse.json(accounts, {status: 200});
    } catch (error) {
        console.log("[ACCOUNTS_GET]", error);
        return new NextResponse("Initial error", {status: 500});
    }
}
