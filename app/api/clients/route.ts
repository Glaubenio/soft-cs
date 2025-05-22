import { authOptions } from "@/lib/auth";
import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { client_service_types, client_statuses } from "@prisma/client";
import { getUser } from "@/actions/get-user";

export async function GET(req: NextRequest) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse("Unauthenticated", { status: 401 });
    }
    const params = req.nextUrl.searchParams
    const name = params.get('name');
    const serviceType = params.get('serviceType')?.split(',').filter((a) => a.length > 0) || [];
    const status = params.get('status')?.split(',').filter((a) => a.length > 0) || [];
    const responsibleId = params.get('responsibleId')?.split(',').filter((a) => a.length > 0) || [];

    let whereClause: any = {};

    if (name && name.length > 0) {
        whereClause.name = {
            contains: name,
            mode: "insensitive"
        };
    }

    if (serviceType.length > 0) {
        whereClause.serviceType = {
            in: serviceType as client_service_types[]
        };
    }
    if (status.length > 0) {
        whereClause.status = {
            in: status as client_statuses[]
        };
    }

    if (responsibleId.length > 0) {
        whereClause.userId = {
            in: responsibleId
        };
    }

    const current_user = await getUser();

    if (!current_user) {
        throw new Error("User not found");
    }

    whereClause.accountId = current_user.accountId


    try {
        const clients = await prismadb.clients.findMany({
            where: whereClause,
            include: {
                tasks: {
                    take: 3,
                    include: {
                        responsible: true,
                    }
                },
                csmResponsible: true,
                journeyStepsClients: {
                    include: {
                        journeyStep: true
                    }
                }
            }
        });

        return NextResponse.json(clients);
    } catch (error) {
        console.log("[USER_GET]", error);
        return new NextResponse("Initial error", { status: 500 });
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
        return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name || !serviceType || !recurringContractRevenue || !status) {
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
        await Promise.all(syncStepsQuery);
        return NextResponse.json({ data: newClient }, { status: 201 });
    } catch
    (error) {
        console.log(error);
        return new NextResponse("Initial error", { status: 500 });
    }
}