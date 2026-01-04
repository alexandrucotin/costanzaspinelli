import { NextRequest, NextResponse } from "next/server";
import { getClientSession } from "@/lib/auth-client";
import { uploadToCloudinary } from "@/lib/cloudinary";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getClientSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;

    if (!file) {
      return NextResponse.json(
        { error: "Nessun file fornito" },
        { status: 400 }
      );
    }

    if (!["front", "side", "back"].includes(type)) {
      return NextResponse.json(
        { error: "Tipo di foto non valido" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo di file non supportato. Usa JPG, PNG o WebP." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File troppo grande. Massimo 10MB." },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const timestamp = Date.now();
    const result = await uploadToCloudinary(
      buffer,
      `costanzaspinelli/progress/${session.clientId}`,
      `${type}_${timestamp}`
    );

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Errore durante l'upload del file" },
      { status: 500 }
    );
  }
}
