import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
// Supports both CLOUDINARY_URL or individual env vars
if (process.env.CLOUDINARY_URL) {
  cloudinary.config(process.env.CLOUDINARY_URL);
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export { cloudinary };

/**
 * Upload image to Cloudinary
 * @param file - File buffer or base64 string
 * @param folder - Folder path in Cloudinary
 * @param publicId - Optional public ID for the image
 * @returns Cloudinary upload result with secure URL
 */
export async function uploadToCloudinary(
  file: Buffer | string,
  folder: string,
  publicId?: string
) {
  try {
    const fileData =
      file instanceof Buffer
        ? `data:image/jpeg;base64,${file.toString("base64")}`
        : file;

    const result = await cloudinary.uploader.upload(fileData as string, {
      folder,
      public_id: publicId,
      resource_type: "image",
      transformation: [
        { width: 1200, height: 1200, crop: "limit" }, // Max dimensions
        { quality: "auto:good" }, // Auto quality optimization
        { fetch_format: "auto" }, // Auto format (WebP when supported)
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Errore durante l'upload dell'immagine");
  }
}

/**
 * Delete image from Cloudinary
 * @param publicId - Public ID of the image to delete
 */
export async function deleteFromCloudinary(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Errore durante l'eliminazione dell'immagine");
  }
}
