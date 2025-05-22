import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prismadb } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
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
