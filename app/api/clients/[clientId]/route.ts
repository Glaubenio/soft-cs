import { authOptions } from "@/lib/auth";
import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const PUT = async (req: Request, props: { params: Promise<{ clientId: string }> }) => {
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
  const params = await props.params;
  const clientId = params.clientId;

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  if (!name || !serviceType || !recurringContractRevenue || !status) {
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
    const updatedClient = await prismadb.clients.update({
      where: {
        id: clientId,
      },
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
    const newJourneys = journeys.filter((journey) => {
      const journeySteps = journey.journeySteps.map((step) => step.id);
      return !client.journeyStepsClients.some((clientStep) => {
        return journeySteps.includes(clientStep.journeyStepId);
      });
    });

    console.log("New Journeys", newJourneys);
    const deletedJourneys = client.journeyStepsClients.filter((clientStep) => {
      const journeySteps = journeys.map((journey) => journey.journeySteps.map((step) => step.id));
      return !journeySteps.flat().includes(clientStep.journeyStepId);
    });
    console.log("Deleted Journeys", deletedJourneys);
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
    console.log("Results", results);
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