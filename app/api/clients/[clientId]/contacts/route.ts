import {authOptions} from "@/lib/auth";
import {prismadb} from "@/lib/prisma";
import {getServerSession} from "next-auth";
import {NextResponse} from "next/server";

export const POST = async (req: Request, props: { params: Promise<{ clientId: string }> }) => {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const params = await props.params;
    const clientId = params.clientId;

    if (!session) {
        return new NextResponse("Unauthenticated", {status: 401});
    }

    try {
        const client = await prismadb.clients.findUnique({
            where: {
                id: clientId,
            }
        })
        if (!client) {
            return new NextResponse("Client not found", {status: 404});
        }

        await prismadb.clients.update({
            where: {
                id: clientId,
            },
            data: {
                contacts: body,
            },
        })

        return NextResponse.json({status: 200});
    } catch (error) {
        console.log(error);
        return new NextResponse("Initial error", {status: 500});
    }
}
