import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const updated = await prisma.wallpaper.update({
      where: { id },
      data: { downloads: { increment: 1 } },
    });
    return NextResponse.json({ id, downloads: updated.downloads });
  } catch {
    return NextResponse.json({ id, downloads: 1 });
  }
}
