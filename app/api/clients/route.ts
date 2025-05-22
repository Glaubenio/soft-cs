import {authOptions} from "@/lib/auth";
import {prismadb} from "@/lib/prisma";
import {getServerSession} from "next-auth";
import {NextResponse} from "next/server";
import {client_service_types, client_statuses} from "@prisma/client";
import {getUser} from "@/actions/get-user";

export async function GET(props: {
    params: Promise<{
        includeAssociations: boolean,
        name?: string,
        serviceType?: string[],
        csmResponsible?: string[],
        status?: string[]
    }>
}) {
    const params = await props.params;
    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse("Unauthenticated", {status: 401});
    }

    let whereClause: any = {};

    if (params.name && params.name.length > 0) {
        whereClause.name = {
            contains: params.name,
            mode: "insensitive"
        };
    }

    if (params.serviceType && params.serviceType.length > 0) {
        whereClause.serviceType = {
            in: params.serviceType as client_service_types[]
        };
    }
    if (params.status && params.status.length > 0) {
        whereClause.status = {
            in: params.status as client_statuses[]
        };
    }

    if (params.csmResponsible && params.csmResponsible.length > 0) {
        whereClause.userId = {
            in: params.csmResponsible
        };
    }

    const current_user = await getUser();

    if (!current_user) {
        throw new Error("User not found");
    }

    whereClause.accountId = current_user.accountId


    try {
        const user = await prismadb.clients.findMany({
            where: whereClause,
            include: {
                tasks: {
                    take: 3,
                    include: {
                        responsible: params.includeAssociations,
                    }
                },
                csmResponsible: params.includeAssociations,
                journeyStepsClients: {
                    include: {
                        journeyStep: params.includeAssociations
                    }
                }
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        console.log("[USER_GET]", error);
        return new NextResponse("Initial error", {status: 500});
    }
}

export const POST = async (req: Request) => {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const {
        name,
        status,
        description,
        serviceType,
        recurringContractRevenue,
        userId,
        journeyIds,
    } = body;

    if (!session) {
        return new NextResponse("Unauthenticated", {status: 401});
    }

    if (!name || !serviceType || !recurringContractRevenue || !status) {
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
        const newClient = await prismadb.clients.create({
            data: {
                name,
                description,
                status,
                userId,
                serviceType,
                recurringContractRevenue,
            },
        });
        const journeys = await prismadb.journeys.findMany({
            include: {
                journeySteps: true,
            },
            where: {
                id: {
                    in: journeyIds,
                },
            },
        });
        const syncStepsQuery = journeys.map(async (journey) => {
                const firstStep = journey.journeySteps.find((step) => step.position === 0)!;
                await prismadb.journey_steps_clients.create({
                    data: {
                        clientId: newClient.id,
                        journeyStepId: firstStep.id,
                    }
                })
            }
        );
        const results = await Promise.all(syncStepsQuery);
        return NextResponse.json({data: newClient}, {status: 201});
    } catch
        (error) {
        console.log(error);
        return new NextResponse("Initial error", {status: 500});
    }
}