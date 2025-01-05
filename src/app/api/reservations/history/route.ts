import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ message: "Authorization header missing" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }

  try {
    const reservations = await prisma.reservation.findMany({
      where: { userId: decoded.id },
      orderBy: { date: "desc" }, // Trie par date décroissante
    });

    return NextResponse.json(reservations, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations :", error);
    return NextResponse.json({ message: "Failed to fetch reservations" }, { status: 500 });
  }
}
