import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "Authorization header missing" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    // Vérification du token et de l'existence de l'ID utilisateur
    if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }

    const body = await req.json();
    const { restaurant, date, time, numberOfPeople } = body;

    // Création de la réservation
    const newReservation = await prisma.reservation.create({
      data: {
        userId: decoded.id, // Assurez-vous que `decoded.id` est correct
        restaurant,
        date: new Date(date),
        time,
        numberOfPeople,
      },
    });

    return NextResponse.json(newReservation, { status: 201 });
  } catch (error) {
    // Gestion des erreurs avec typage explicite
    if (error instanceof Error) {
      console.error("Erreur lors de la création de la réservation :", error.message);
      return NextResponse.json(
        { message: "Failed to create reservation", error: error.message },
        { status: 500 }
      );
    }
    console.error("Erreur inconnue :", error);
    return NextResponse.json({ message: "Unknown error occurred" }, { status: 500 });
  }
}
