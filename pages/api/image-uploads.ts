import { IncomingForm, Part, Files } from "formidable";
import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const uploadDir = path.join(process.cwd(), "public/uploads");
  fs.mkdirSync(uploadDir, { recursive: true });

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    filename: (_name: string, _ext: string, part: Part) => {
      const timestamp = Date.now();
      const original = part.originalFilename?.replace(/\s+/g, "-") || "file";
      return `${timestamp}-${original}`;
    },
  });

  form.parse(req, (err, fields, files: Files) => {
    if (err) {
      return res.status(500).json({ error: "Upload failed" });
    }

    const fileEntry = files.file;
    const file = Array.isArray(fileEntry) ? fileEntry[0] : fileEntry;

    if (!file || !file.filepath) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileName = path.basename(file.filepath);
    const fileUrl = `/uploads/${fileName}`;

    return res.status(200).json({ url: fileUrl });
  });
}
