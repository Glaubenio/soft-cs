import { authOptions } from "@/lib/auth";
import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { client_service_types, client_statuses, ImageUpload } from "@prisma/client";
import { getUser } from "@/actions/get-user";
import { s3Client } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

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
                avatar: true,
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
    const body = await req.formData();
    const userId = body.get('userId')?.toString();
    const journeyIds = JSON.parse(body.get("journeyIds")?.toString() || "[]") || [];
    const recurringContractRevenue = parseFloat(body.get("recurringContractRevenue")?.toString() || "0");
    const name = body.get("name")?.toString();
    const status = body.get("status")?.toString() as client_statuses;
    const description = body.get("description")?.toString();
    const serviceType = body.get("serviceType")?.toString() as client_service_types;


    if (!session) {
        return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name || !serviceType || !status) {
        return new NextResponse("Missing one of the task data ", { status: 400 });
    }

    try {
        const avatar = body.get("avatar")
        let avatarImageUpload: ImageUpload | null = null;
        if (avatar && avatar instanceof File) {
            const bytes = await avatar.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const extension = avatar.name.split(".").pop();
            const fileName = `${name.replace(/\s+/g, "_")}-${Date.now()}.${extension}`;
            await s3Client.send(new PutObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: `clients/${fileName}`,
                Body: buffer,
                ContentType: avatar.type,
                ACL: "public-read",
            }))
            avatarImageUpload = await prismadb.imageUpload.create({
                data: {
                    image_url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/clients/${fileName}`,
                }
            })
        }
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
                serviceType,
                recurringContractRevenue,
                ...accountConnect,
                csmResponsible: {
                    connect: {
                        id: userId,
                    },
                },
                avatar: avatarImageUpload ? {
                    connect: {
                        id: avatarImageUpload.id,
                    }
                } : undefined,

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