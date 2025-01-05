// Ce fichier contient des fonctions utilitaires liées à la gestion de l'authentification.
// Ces fonctions incluent le hashage et la vérification des mots de passe, ainsi que la génération et la validation des tokens JWT.
// Il est utilisé pour sécuriser les opérations d'authentification dans l'application.

import bcrypt from "bcryptjs"; // J'utilise bcrypt pour sécuriser les mots de passe via un hashage
import jwt, { JwtPayload } from "jsonwebtoken"; // J'utilise jsonwebtoken pour générer et vérifier des tokens JWT

// Fonction pour hacher un mot de passe avant de le stocker dans la base de données
export function hashPassword(password: string): string {
    // bcrypt.hashSync génère un hash sécurisé avec un "salt" pour plus de sécurité
    return bcrypt.hashSync(password, 10); // 10 correspond au facteur de complexité du "salt"
}

// Fonction pour comparer un mot de passe en clair avec son hash (ex : lors de la connexion)
export function comparePasswords(password: string, hashedPassword: string): boolean {
    // bcrypt.compareSync renvoie true si le mot de passe correspond au hash, false sinon
    return bcrypt.compareSync(password, hashedPassword);
}

// Fonction pour générer un token JWT
export function generateToken(payload: object): string {
    // jwt.sign génère un token encodé avec une clé secrète définie dans process.env.JWT_SECRET
    // Le token a une durée de vie définie (1 heure ici)
    return jwt.sign(payload, process.env.JWT_SECRET || "default_secret", { expiresIn: "1h" });
}

// Fonction pour vérifier et décoder un token JWT
export function verifyToken(token: string): JwtPayload | null {
    try {
        // jwt.verify décode le token et vérifie qu'il a été signé avec la clé secrète correcte
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");

        // Je m'assure que le résultat est un objet et non une string
        if (typeof decoded === "object" && decoded !== null) {
            return decoded as JwtPayload; // Retourne le token décodé (typé comme JwtPayload)
        }

        return null; // Si le token décodé est une string, je retourne null
    } catch {
        // En cas d'erreur (token expiré ou invalide), je retourne null
        return null;
    }
}

// Ce fichier est essentiel pour sécuriser les mots de passe et gérer les tokens JWT dans l'application.
// Les fonctions ici sont réutilisables et centralisées pour simplifier les opérations d'authentification.

