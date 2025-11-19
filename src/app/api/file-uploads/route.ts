import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// 🟢 UPLOAD FILE(S)
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("file") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `uploads/${randomUUID()}-${file.name}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: fileName,
          Body: buffer,
          ContentType: file.type,
        })
      );

      return `https://${process.env.AWS_S3_BUCKET!}.s3.${process.env.AWS_REGION!}.amazonaws.com/${fileName}`;
    });

    const urls = await Promise.all(uploadPromises);

    if (urls.length === 1) return NextResponse.json({ url: urls[0] });
    return NextResponse.json({ urls });
  } catch (error) {
    console.error("S3 file upload error:", error);
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}

// 🗑️ DELETE FILE
export async function DELETE(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: "Missing file URL" }, { status: 400 });

    const key = url.split(".amazonaws.com/")[1];
    if (!key) return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: key,
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("S3 file delete error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
