import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary";

export interface CloudinaryUploadResult {
  imageUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
}

export async function uploadToCloudinary(
  buffer: Buffer,
  filename: string = "wallpaper"
): Promise<CloudinaryUploadResult> {
  // If Cloudinary keys are provided, upload to Cloudinary CDN
  if (isCloudinaryConfigured()) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "wallora",
          resource_type: "image",
          public_id: `${Date.now()}-${filename.replace(/[^a-zA-Z0-9]/g, "_")}`,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error("Cloudinary upload failed"));
          }

          const thumbnailUrl = cloudinary.url(result.public_id, {
            width: 600,
            crop: "scale",
            secure: true,
          });

          resolve({
            imageUrl: result.secure_url,
            thumbnailUrl,
            width: result.width,
            height: result.height,
          });
        }
      );

      stream.end(buffer);
    });
  }

  // Graceful fallback for local educational dev when Cloudinary keys aren't set
  const base64 = `data:image/jpeg;base64,${buffer.toString("base64")}`;
  return {
    imageUrl: base64,
    thumbnailUrl: base64,
    width: 1920,
    height: 1080,
  };
}
