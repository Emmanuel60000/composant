// Ce fichier définit des schémas de validation pour les données d'inscription et de connexion.
// Il utilise la bibliothèque "zod" pour s'assurer que les données reçues respectent des critères spécifiques avant de les traiter dans l'application.
// Cela permet de garantir la cohérence et la sécurité des données.

import { z } from "zod"; // J'importe la bibliothèque zod pour définir et valider des schémas de données

// Schéma de validation pour l'inscription (register)
export const registerSchema = z.object({
    // L'email doit être une chaîne valide et correspondre au format d'un email
    email: z.string().email("Email invalide"),

    // Le mot de passe doit être une chaîne avec au moins 6 caractères
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

// Schéma de validation pour la connexion (login)
export const loginSchema = z.object({
    // Même validation pour l'email que pour l'inscription
    email: z.string().email("Email invalide"),

    // Même validation pour le mot de passe que pour l'inscription
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

// Ce fichier est essentiel pour garantir que les données reçues par l'application respectent un format et des critères spécifiques.
// Cela évite les erreurs côté serveur et améliore la sécurité en rejetant les données non valides.
