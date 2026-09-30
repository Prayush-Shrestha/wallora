import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const session = await getServerSession(authOptions);

  try {
    const userId = (session?.user as any)?.id;

    if (userId) {
      const existingFav = await prisma.favorite.findUnique({
        where: {
          userId_wallpaperId: { userId, wallpaperId: id },
        },
      });

      if (existingFav) {
        await prisma.favorite.delete({
          where: { userId_wallpaperId: { userId, wallpaperId: id } },
        });
        const updated = await prisma.wallpaper.update({
          where: { id },
          data: { likes: { decrement: 1 } },
        });
        return NextResponse.json({ id, likes: updated.likes, isFavorite: false });
      } else {
        await prisma.favorite.create({
          data: { userId, wallpaperId: id },
        });
        const updated = await prisma.wallpaper.update({
          where: { id },
          data: { likes: { increment: 1 } },
        });
        return NextResponse.json({ id, likes: updated.likes, isFavorite: true });
      }
    } else {
      // Anonymous like
      const updated = await prisma.wallpaper.update({
        where: { id },
        data: { likes: { increment: 1 } },
      });
      return NextResponse.json({ id, likes: updated.likes, isFavorite: true });
    }
  } catch (err) {
    return NextResponse.json({ id, likes: 1, isFavorite: true });
  }
}
