"use server";

import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";
import moment from "moment";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email && !otp) {
      return NextResponse.json({ message: "Email and OTP are required!" }, { status: 400 });
    }

    const user = await prismadb.users.findFirst({
      where: {
        email: email,
        recoverPasswordCode: otp,
      },
    });
    if (!user) {
      return NextResponse.json({ message: "Código de recuperação inválido." }, { status: 400 });
    }

    const expiresDate = moment(user?.recoverPasswordCodeExpiresAt);
    const isExpired = expiresDate.isBefore(moment());
    if (isExpired) {
      return NextResponse.json({ message: "O código expirou. Por favor, gere um novo e tente novamente." }, { status: 400 });
    }

    return NextResponse.json({ message: "Code validated", status: true });
  } catch (error) {
    console.log("[USER_PASSWORD_CHANGE_POST]", error);
    return new NextResponse("Initial error", { status: 500 });
  }
}
