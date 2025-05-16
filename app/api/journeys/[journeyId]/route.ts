import { prismadb } from "@/lib/prisma";

export const PUT = async (req: Request, { params }: { params: Promise<{ journeyId: string }> }) => {
  const { journeyId } = await params;
  const body = await req.json();
  const { name, steps } = body;
  const updatedJourney = await prismadb.journeys.update({
    where: { id: journeyId },
    data: {
      name: name,
      journeySteps: {
        deleteMany: {},
        create: steps.map((step: any) => ({
          name: step.name,
          color: step.color,
        })),
      },
    },
  });

  return new Response(JSON.stringify({ message: "Journey updated successfully" }), { status: 200 });
}

export const DELETE = async (req: Request, { params }: { params: Promise<{ journeyId: string }> }) => {
  const { journeyId } = await params;

  await prismadb.journeys.delete({
    where: { id: journeyId },
  });

  return new Response(JSON.stringify({ message: "Journey deleted successfully" }), { status: 200 });
}