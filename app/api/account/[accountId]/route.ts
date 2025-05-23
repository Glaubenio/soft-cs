import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";
import { getUser } from "@/actions/get-user";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { ImageUpload } from "@prisma/client";
import { s3Client } from "@/lib/s3";

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
    const body = await req.formData();
    const name = body.get("name")?.toString() || "";
    const email = body.get("name")?.toString();
    const cnpj = body.get("cnpj")?.toString();
    const segment = body.get("segment")?.toString();
    const size = body.get("size")?.toString();

    const avatar = body.get("avatar")
    let avatarImageUpload: ImageUpload | null = null;
    if (avatar && avatar instanceof File) {
      const bytes = await avatar.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const extension = avatar.name.split(".").pop();
      const fileName = `${name.replace(/\s+/g, "_")}-${Date.now()}.${extension}`;
      await s3Client.send(new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `accounts/${fileName}`,
        Body: buffer,
        ContentType: avatar.type,
        ACL: "public-read",
      }))
      avatarImageUpload = await prismadb.imageUpload.create({
        data: {
          image_url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/accounts/${fileName}`,
        }
      })
    }

    const account = await prismadb.crm_Accounts.update({
      where: {
        id: params.accountId,
      },
      data: {
        name,
        email,
        cnpj,
        segment,
        size,
        imageUpload: avatarImageUpload ? {
          connect: {
            id: avatarImageUpload.id,
          }
        } : undefined,
      },
    });

    return NextResponse.json({ account }, { status: 200 });
  } catch (error) {
    console.log("[UPDATE_ACCOUNT_PUT]", error);
    return new NextResponse("Initial error", { status: 500 });
  }
}