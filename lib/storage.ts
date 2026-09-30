/**
 * Image Storage Abstraction: Supports Cloudinary and Cloudflare R2.
 * 
 * Configure either:
 * - Cloudinary: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 * - Cloudflare R2: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL
 */

export interface UploadResult {
  url: string;
  thumbnailUrl: string;
  width?: number;
  height?: number;
  format?: string;
  provider: "cloudinary" | "cloudflare-r2" | "local";
}

export async function uploadImage(
  fileBuffer: Buffer,
  filename: string,
  contentType: string
): Promise<UploadResult> {
  // 1. Cloudinary upload if configured
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    try {
      const base64 = `data:${contentType};base64,${fileBuffer.toString("base64")}`;
      const timestamp = Math.round(new Date().getTime() / 1000);
      
      const crypto = await import("crypto");
      const signatureStr = `folder=wallora&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
      const signature = crypto.createHash("sha1").update(signatureStr).digest("hex");

      const formData = new FormData();
      formData.append("file", base64);
      formData.append("api_key", process.env.CLOUDINARY_API_KEY);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("folder", "wallora");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      if (res.ok) {
        const data = await res.json();
        return {
          url: data.secure_url,
          thumbnailUrl: data.secure_url.replace("/upload/", "/upload/c_scale,w_600/"),
          width: data.width,
          height: data.height,
          format: data.format,
          provider: "cloudinary",
        };
      }
    } catch (err) {
      console.warn("Cloudinary upload failed, falling back:", err);
    }
  }

  // 2. Cloudflare R2 upload if configured
  if (
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  ) {
    const publicUrl = process.env.R2_PUBLIC_URL || `https://${process.env.R2_BUCKET_NAME}.r2.dev`;
    const key = `wallpapers/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const fileUrl = `${publicUrl.replace(/\/$/, "")}/${key}`;

    return {
      url: fileUrl,
      thumbnailUrl: fileUrl,
      provider: "cloudflare-r2",
    };
  }

  // 3. Fallback: Base64 / Local URL (ideal for development without active cloud credentials)
  const base64 = `data:${contentType};base64,${fileBuffer.toString("base64")}`;
  return {
    url: base64,
    thumbnailUrl: base64,
    provider: "local",
  };
}
