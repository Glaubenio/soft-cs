"use server";

import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";
import { hash } from "bcryptjs";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp, password, password_confirmation } = body;
    const isPasswordStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/.test(password);
    if (!isPasswordStrong) {
      return NextResponse.json({ message: "A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais." }, { status: 400 });
    }
    if (!email || !otp || !password || !password_confirmation) {
      return NextResponse.json({ message: "Email and OTP are required!" }, { status: 400 });
    }

    if (password !== password_confirmation) {
      return NextResponse.json({ message: "As senhas não coincidem." }, { status: 400 });
    }

    const user = await prismadb.users.findFirst({
      where: {
        email: email,
        recoverPasswordCode: otp,
      },
    });
    if (!user) {
      return NextResponse.json({ message: "Usuário não encontrado ou código de recuperação inválido." }, { status: 400 });
    }
    const lowerCasedPassword = password.toLowerCase();
    if (lowerCasedPassword.includes(user.name?.toLowerCase()) ||
      lowerCasedPassword.includes(user.email.toLowerCase()) ||
      lowerCasedPassword.includes(user.username?.toLowerCase())) {
      return NextResponse.json({ message: "A senha não pode conter seu nome ou endereço de email." }, { status: 400 });
    }

    const updatedUser = await prismadb.users.update({
      where: { id: user.id },
      data: {
        password: await hash(password, 12),
        recoverPasswordCode: null,
        recoverPasswordCodeExpiresAt: null,
      },
    });
    if (!updatedUser) {
      return NextResponse.json({ message: "Erro ao atualizar a senha." }, { status: 400 });
    }
    return NextResponse.json({ message: "Senha atualizada com sucesso", status: true });
  } catch (error) {
    console.log("[USER_PASSWORD_CHANGE_POST]", error);
    return new NextResponse("Initial error", { status: 500 });
  }
}
