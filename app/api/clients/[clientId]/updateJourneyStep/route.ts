import { authOptions } from "@/lib/auth";
import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const PUT = async (req: Request, props: { params: Promise<{ clientId: string }> }) => {
  const session = await getServerSession(authOptions);
  const body = await req.json();
  const {
    sourceJourneyStepId,
    newJourneyStepId,
  } = body;
  const params = await props.params;
  const clientId = params.clientId;

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  try {
    const client = await prismadb.clients.findUnique({
      where: {
        id: clientId,
      }
    })
    if (!client) {
      return new NextResponse("Client not found", { status: 404 });
    }

    await prismadb.journey_steps_clients.updateMany({
      where: {
        clientId: clientId,
        journeyStepId: sourceJourneyStepId,
      },
      data: {
        journeyStepId: newJourneyStepId,
      },
    })

    return NextResponse.json({ status: 200 });
  } catch
  (error) {
    console.log(error);
    return new NextResponse("Initial error", { status: 500 });
  }
}
