// Ce fichier définit une route API protégée par un token JWT.
// Son objectif est de valider le token envoyé dans le header "Authorization" 
// et de permettre l'accès uniquement aux utilisateurs authentifiés.

import { verifyToken } from "@/utils/auth"; // J'importe ma fonction de vérification du token depuis mon utilitaire d'authentification
import { NextRequest, NextResponse } from "next/server"; // J'importe les classes nécessaires pour gérer les requêtes et réponses dans Next.js

// Voici ma fonction qui gère les requêtes GET pour cette route protégée
export async function GET(req: NextRequest) {
    // Je récupère le header Authorization de la requête pour extraire le token JWT
    const authHeader = req.headers.get("Authorization");
    
    // Si le header Authorization est manquant, je retourne une réponse avec un statut 401 (non autorisé)
    if (!authHeader) {
        return NextResponse.json({ message: "Authorization header missing" }, { status: 401 });
    }

    // Je sépare le token JWT du reste du header Authorization (le format attendu est "Bearer <token>")
    const token = authHeader.split(" ")[1]; 

    // Je vérifie la validité du token en appelant ma fonction verifyToken
    const decoded = verifyToken(token);

    // Si le token est invalide ou expiré, je retourne une réponse 401 (non autorisé)
    if (!decoded) {
        return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }

    // Si tout va bien, je retourne une réponse 200 (succès) avec un message et les informations décodées du token
    return NextResponse.json({ message: "Access granted", user: decoded }, { status: 200 });
}

// Ce fichier est donc essentiel pour sécuriser l'accès à des routes ou des ressources sensibles
// en s'assurant que seul un utilisateur authentifié puisse y accéder.
