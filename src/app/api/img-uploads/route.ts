import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const fileName = `uploads/${randomUUID()}-${file.name}`;

        await s3.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET!,
                Key: fileName,
                Body: fileBuffer,
                ContentType: file.type,
                // ❌ REMOVE ACL — your bucket does not allow it
            })
        );

        // if your bucket is public or you use CloudFront, this will still work:
        const imageUrl = `https://${process.env.AWS_S3_BUCKET!}.s3.${process.env.AWS_REGION!}.amazonaws.com/${fileName}`;

        return NextResponse.json({ url: imageUrl });
    } catch (error) {
        console.error("S3 upload error:", error);
        return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
    }
}
