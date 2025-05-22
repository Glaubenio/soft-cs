import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";
import {getUser} from "@/actions/get-user";

export async function DELETE(req: Request, props: { params: Promise<{ accountId: string }> }) {
  const params = await props.params;
  const currentUser = await getUser()

  if (!currentUser) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  if (!currentUser.is_admin) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    await prismadb.crm_Accounts.delete({
      where: {
        id: params.accountId,
      },
    });

    return NextResponse.json({ message: "Account deleted" }, { status: 200 });
  } catch (error) {
    console.log("[ACCOUNT_DELETE]", error);
    return new NextResponse("Initial error", { status: 500 });
  }
}

export async function PUT(req: Request, props: { params: Promise<{ accountId: string }> }) {
  const params = await props.params;

  const currentUser = await getUser()

  if (!currentUser) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  if (!currentUser.is_admin) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      name,
      email,
      cnpj,
      segment,
      size
    } = body;

    const account = await prismadb.crm_Accounts.update({
      where: {
        id: params.accountId,
      },
      data: {
        name,
        email,
        cnpj,
        segment,
        size
      },
    });

    return NextResponse.json({account}, {status: 200});
  } catch (error) {
    console.log("[UPDATE_ACCOUNT_PUT]", error);
    return new NextResponse("Initial error", {status: 500});
  }
}