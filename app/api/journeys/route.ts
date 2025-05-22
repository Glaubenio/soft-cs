import {getUser} from "@/actions/get-user";
import {NextResponse} from "next/server";
import {prismadb} from "@/lib/prisma";

export async function GET() {
    const user = await getUser();
    const accountId = user.accountId;

    if (!accountId) {
        throw new Error("Account ID is required");
    }

    const whereClause: any = {}

    if (accountId) {
        whereClause.accountId = accountId;
    }

    try {
        const journeys = await prismadb.journeys.findMany({
            where: whereClause,
            include: {
                journeySteps: true
            }
        });

        return NextResponse.json(journeys);
    } catch (error) {
        console.log("[USER_GET]", error);
        return new NextResponse("Initial error", {status: 500});
    }
}

export const POST = async (req: Request) => {
    try {


        const user = await getUser();
        const accountId = user.accountId;
        if (!accountId) {
            return NextResponse.json(
                {message: "Unauthorized"},
                {
                    status: 401,
                }
            );
        }
        const body = await req.json();
        const {name, steps} = body;
        const newJourney = await prismadb.journeys.create({
            data: {
                name: name,
                accountId: accountId,
                journeySteps: {
                    create: steps.map((step: any) => ({
                            name: step.name,
                            color: step.color,
                        }
                    )),
                },
            }
        })
        return NextResponse.json({data: newJourney}, {status: 201});
    } catch (error) {
        console.log("Error creating journey", error);
        return NextResponse.json(
            {message: "Error creating journey"},
            {
                status: 500,
            }
        );
    }
}