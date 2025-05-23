import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";
import { getUser } from "@/actions/get-user";
import { s3Client } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { ImageUpload } from "@prisma/client";

export async function POST(req: Request) {
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

        const newAccount = await prismadb.crm_Accounts.create({
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

        return NextResponse.json({ newAccount }, { status: 200 });
    } catch (error) {
        console.log("[NEW_ACCOUNT_POST]", error);
        return new NextResponse("Initial error", { status: 500 });
    }
}

export async function GET() {
    const currentUser = await getUser()

    if (!currentUser) {
        return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!currentUser.is_admin) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    try {
        const accounts = await prismadb.crm_Accounts.findMany({
            include: {
                imageUpload: true,
            },
        });

        return NextResponse.json(accounts, { status: 200 });
    } catch (error) {
        console.log("[ACCOUNTS_GET]", error);
        return new NextResponse("Initial error", { status: 500 });
    }
}
