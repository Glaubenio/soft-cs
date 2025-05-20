import { authOptions } from "@/lib/auth";
import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

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
    const results = await Promise.all(syncStepsQuery);
    return NextResponse.json({ data: newClient }, { status: 201 });
  } catch
  (error) {
    console.log(error);
    return new NextResponse("Initial error", { status: 500 });
  }
}