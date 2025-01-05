// Ce fichier gère l'inscription des utilisateurs via une route API (POST).
// Il effectue les actions suivantes :
// 1. Valide les données envoyées par le client (email, mot de passe).
// 2. Vérifie si l'utilisateur existe déjà dans la base de données.
// 3. Si l'utilisateur n'existe pas, il hash le mot de passe et enregistre les informations dans la base de données.
// 4. Retourne une réponse appropriée en fonction du succès ou de l'échec.

import { PrismaClient } from "@prisma/client"; // Prisma est utilisé pour interagir avec la base de données
import { hashPassword } from "@/utils/auth"; // J'importe une fonction pour hasher les mots de passe
import { registerSchema } from "@/utils/validationSchemas"; // J'importe le schéma de validation pour l'inscription
import { NextRequest, NextResponse } from "next/server"; // J'importe les classes nécessaires pour gérer les requêtes et réponses dans Next.js

const prisma = new PrismaClient(); // J'instancie Prisma pour interagir avec la base de données

// Fonction pour gérer les requêtes POST sur la route /api/register
export async function POST(req: NextRequest) {
    try {
        // 1. Lire et parser les données de la requête
        const body = await req.json();
        console.log("Corps reçu :", body); 

        // 2. Valider les données d'entrée
        registerSchema.parse(body); // Vérifie que les données respectent le schéma de validation

        const { email, password } = body;
        console.log("Données valides :", { email, password });

        // 3. Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            console.log("L'email est déjà utilisé :", email); 
            return NextResponse.json({ message: "Email already in use" }, { status: 400 });
        }

        // 4. Créer un nouvel utilisateur avec un mot de passe hashé
        const hashedPassword = hashPassword(password); // Hashe le mot de passe pour le stocker de manière sécurisée
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        console.log("Nouvel utilisateur créé :", newUser); 

        // 5. Répondre avec succès
        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        // Gestion des erreurs
        if (error instanceof Error) {
            console.error("Erreur :", error.message); // Log de l'erreur pour débogage
            return NextResponse.json(
                { message: "User registration failed", error: error.message },
                { status: 400 }
            );
        } else {
            console.error("Erreur inconnue :", error); // Log pour toute autre erreur
            return NextResponse.json(
                { message: "Unknown error occurred" },
                { status: 500 }
            );
        }
    }
}

// Ce fichier est essentiel pour gérer l'inscription des utilisateurs de manière sécurisée et centralisée.
// Il garantit que les données sont validées avant d'être insérées dans la base de données et utilise des pratiques sécurisées comme le hashage des mots de passe.
