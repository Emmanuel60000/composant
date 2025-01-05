"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CustomButtonProps = {
  href?: string;
  label: string;
  onClick?: () => void;
};

// Composant réutilisable pour un bouton ou un lien
function CustomButton({ href, label, onClick }: CustomButtonProps) {
  return href ? (
    <Link
      href={href}
      className="block bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 text-center"
    >
      {label}
    </Link>
  ) : (
    <button
      onClick={onClick}
      className="block bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 text-center"
    >
      {label}
    </button>
  );
}

// Composant des boutons d'authentification
export default function AuthButtons() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Vérifie si un token est présent
    setIsAuthenticated(!!token); // Authentifié si un token existe
    setIsLoading(false); // Fin du chargement
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Supprime le token
    setIsAuthenticated(false);
    alert("Vous êtes déconnecté !");
  };

  if (isLoading) {
    return <p className="text-lg font-bold">Chargement...</p>; // Message pendant la vérification
  }

  return (
    <div className="space-y-4">
      {!isAuthenticated && (
        <>
          <CustomButton href="/signup" label="Inscription" />
          <CustomButton href="/login" label="Connexion" />
        </>
      )}
      {isAuthenticated && (
        <CustomButton label="Déconnexion" onClick={handleLogout} />
      )}
    </div>
  );
}
