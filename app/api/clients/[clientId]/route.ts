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
    const user = await prismadb.users.findUnique({
      where: {
        id: session.user.id,
      }
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }
    const client = await prismadb.clients.findUnique({
      where: {
        id: clientId,
      }
    })
    if (!client) {
      return new NextResponse("Client not found", { status: 404 });
    }

    const accountConnect: any = {}
    accountConnect.account = {
      connect: {
        id: user.accountId,
      },
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
    await prismadb.journey_steps_clients.deleteMany({
      where: {
        clientId: clientId,
      }
    })
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