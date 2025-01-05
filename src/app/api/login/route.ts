// Ce fichier définit une route API pour gérer la connexion des utilisateurs.
// Il vérifie les informations d'identification fournies par l'utilisateur (email et mot de passe),
// et, en cas de succès, génère un token JWT pour l'authentification des futures requêtes.
// Cette route utilise Prisma pour interagir avec la base de données et des utilitaires pour sécuriser l'authentification.

import { PrismaClient } from "@prisma/client"; // Prisma est utilisé pour interagir avec la base de données
import { comparePasswords, generateToken } from "@/utils/auth"; // J'importe des fonctions pour vérifier le mot de passe et générer un token JWT
import { loginSchema } from "@/utils/validationSchemas"; // J'importe le schéma de validation pour la connexion
import { NextRequest, NextResponse } from "next/server"; // J'importe les classes nécessaires pour gérer les requêtes et réponses dans Next.js

const prisma = new PrismaClient(); // J'instancie Prisma pour interagir avec la base de données

// Fonction pour gérer les requêtes POST sur la route /api/login
export async function POST(req: NextRequest) {
    try {
        // Je récupère le corps de la requête au format JSON
        const body = await req.json();

        // Je valide les données reçues à l'aide du schéma loginSchema
        loginSchema.parse(body);

        // Je déstructure les champs email et password depuis les données validées
        const { email, password } = body;

        // Je recherche l'utilisateur correspondant à l'email dans la base de données
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // Si l'utilisateur n'existe pas ou si le mot de passe est incorrect, je retourne une erreur 401 (non autorisé)
        if (!user || !comparePasswords(password, user.password)) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }

        // Si les informations sont correctes, je génère un token JWT avec les informations de l'utilisateur
        const token = generateToken({ id: user.id, email: user.email });

        // Je retourne le token JWT au client avec un statut 200 (succès)
        return NextResponse.json({ token }, { status: 200 });
    } catch (error) {
        // Si une erreur survient, je la gère avec un typage explicite
        if (error instanceof Error) {
            console.error("Erreur :", error.message); // J'affiche l'erreur dans les logs
            return NextResponse.json({ message: "Authentication failed", error: error.message }, { status: 500 });
        } else {
            console.error("Erreur inconnue :", error); // Pour toute autre erreur, j'affiche un message générique
            return NextResponse.json({ message: "Unknown error occurred" }, { status: 500 });
        }
    }
}

// Ce fichier est essentiel pour authentifier les utilisateurs de l'application.
// Il sécurise les informations d'identification, vérifie les données, et génère un token JWT pour les futures requêtes authentifiées.
