import { authOptions } from "@/lib/auth";
import { prismadb } from "@/lib/prisma";
import { s3Client } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { client_service_types, client_statuses, ImageUpload } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const PUT = async (req: Request, props: { params: Promise<{ clientId: string }> }) => {
  const session = await getServerSession(authOptions);
  const body = await req.formData();

  const userId = body.get('userId')?.toString() || null;
  const journeyIds = JSON.parse(body.get("journeyIds")?.toString() || "[]") || [];
  const recurringContractRevenue = parseFloat(body.get("recurringContractRevenue")?.toString() || "0");
  const name = body.get("name")?.toString() || null;
  const status = body.get("status")?.toString() as client_statuses || null;
  const description = body.get("description")?.toString() || null;
  const serviceType = body.get("serviceType")?.toString() as client_service_types || null;
  const params = await props.params;
  const clientId = params.clientId;

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  if (!name || !serviceType || !status) {
    return new NextResponse("Missing one of the task data ", { status: 400 });
  }

  try {

    const client = await prismadb.clients.findUnique({
      include: {
        journeyStepsClients: true,
      },
      where: {
        id: clientId,
      }
    })
    if (!client) {
      return new NextResponse("Client not found", { status: 404 });
    }

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

    const updatedClient = await prismadb.clients.update({
      where: {
        id: clientId,
      },
      data: {
        name,
        description,
        status,
        serviceType,
        recurringContractRevenue,
        avatar: avatarImageUpload ? {
          connect: {
            id: avatarImageUpload.id,
          }
        } : undefined,
        csmResponsible: userId ? {
          connect: {
            id: userId,
          }
        } : undefined
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
    const newJourneys = journeys.filter((journey) => {
      const journeySteps = journey.journeySteps.map((step) => step.id);
      return !client.journeyStepsClients.some((clientStep) => {
        return journeySteps.includes(clientStep.journeyStepId);
      });
    });

    const deletedJourneys = client.journeyStepsClients.filter((clientStep) => {
      const journeySteps = journeys.map((journey) => journey.journeySteps.map((step) => step.id));
      return !journeySteps.flat().includes(clientStep.journeyStepId);
    });
    await prismadb.journey_steps_clients.deleteMany({
      where: {
        id: {
          in: deletedJourneys.map((journey) => journey.id),
        },
      }
    })
    const syncStepsQuery = newJourneys.map(async (journey) => {

      const firstStep = journey.journeySteps[0];
      await prismadb.journey_steps_clients.create({
        data: {
          clientId: clientId,
          journeyStepId: firstStep.id,
        }
      })
    }
    );
    const results = await Promise.all(syncStepsQuery);
    return NextResponse.json({ data: updatedClient }, { status: 200 });
  } catch
  (error) {
    console.log(error);
    return new NextResponse("Initial error", { status: 500 });
  }
}

export const DELETE = async (req: Request, props: { params: Promise<{ clientId: string }> }) => {
  const params = await props.params;
  const clientId = params.clientId;

  const client = await prismadb.clients.findUnique({
    where: {
      id: clientId,
    }
  })
  if (!client) {
    return new NextResponse("Client not found", { status: 404 });
  }
  await prismadb.journey_steps_clients.deleteMany({
    where: {
      clientId: clientId,
    }
  })
  await prismadb.clients.delete({
    where: {
      id: clientId,
    }
  })
  return NextResponse.json({ status: 204 });
}