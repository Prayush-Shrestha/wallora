import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateWallpaperWithAI } from "@/lib/ai-provider";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { prompt, style, orientation, resolution, mood, color } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "A descriptive prompt is required" },
        { status: 400 }
      );
    }

    const generated = await generateWallpaperWithAI({
      prompt,
      style,
      orientation,
      resolution,
      mood,
      color,
    });

    // Optionally save to PostgreSQL AICreation model if database is connected
    try {
      const userId = (session?.user as any)?.id || null;
      await prisma.aICreation.create({
        data: {
          id: generated.id,
          userId,
          image: generated.imageUrl,
          prompt,
          style: style || "cinematic",
          orientation: orientation || "landscape",
          resolution: resolution || "4k",
          seed: generated.seed,
        },
      });
    } catch (dbErr) {
      console.warn("Could not persist AI creation to DB (continuing):", dbErr);
    }

    return NextResponse.json({
      success: true,
      creation: generated,
    });
  } catch (err: any) {
    console.error("AI Generation route error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate wallpaper" },
      { status: 500 }
    );
  }
}
