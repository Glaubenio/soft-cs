"use server";

import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";

import { generateRandomPassword } from "@/lib/utils";

import PasswordResetEmail from "@/emails/PasswordReset";
import resendHelper from "@/lib/resend";
import moment from "moment";
import { DataTableColumnHeader } from "@/app/[locale]/(routes)/crm/contacts/table-components/data-table-column-header";

export async function POST(req: Request) {

  const resend = await resendHelper();
  const recoverPasswordCode = `${Math.floor(Math.random() * (999999 + 1))}`.padStart(6, '0');

  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: "Email é obrigatório" }, { status: 400 });
    }

    const password = generateRandomPassword();

    const user = await prismadb.users.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 400 });
    }
    const recoverPasswordCode = `${Math.floor(Math.random() * (999999 + 1))}`.padStart(6, '0');
    const newpassword = await prismadb.users.update({
      where: { id: user.id },
      data: {
        recoverPasswordCodeExpiresAt: moment().add(5, "minute").toDate(),
        recoverPasswordCode: recoverPasswordCode,
      },
    });

    if (!newpassword) {
      return new NextResponse("Password not updated!", {
        status: 401,
      });
    } else {
      const data = await resend.emails.send({
        from: "Soft CS <naoresponsa@softcs.com.br>",
        to: user.email,
        subject: "Soft CS - Recupere sua senha",
        text: "",
        react: PasswordResetEmail({
          username: user?.name!,
          avatar: user.avatar,
          email: user.email,
          password: password,
          userLanguage: user.userLanguage,
          recoverPasswordCode: recoverPasswordCode,
        }),
      });
      console.log(data)
    }

    return NextResponse.json({ message: "Código de recuperação enviado!", status: true });
  } catch (error) {
    console.log("[USER_PASSWORD_CHANGE_POST]", error);
    return new NextResponse("Initial error", { status: 500 });
  }
}
