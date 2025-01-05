"use client"; // Indique que ce composant est un composant client dans Next.js (App Router).

import { useState } from "react"; // J'importe le hook useState pour gérer l'état local.
import { useRouter } from "next/navigation"; // J'importe useRouter pour rediriger les utilisateurs après l'inscription.

export default function Signup() {
  // États locaux pour gérer l'email, le mot de passe, et les erreurs
  const [email, setEmail] = useState(""); // Stocke l'email de l'utilisateur
  const [password, setPassword] = useState(""); // Stocke le mot de passe de l'utilisateur
  const [error, setError] = useState(""); // Stocke le message d'erreur
  const router = useRouter(); // Utilisé pour rediriger l'utilisateur

  // Fonction pour gérer la soumission du formulaire d'inscription
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page par défaut
    setError(""); // Réinitialise le message d'erreur

    // Envoi des données d'inscription à l'API
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }), // Convertit les données en JSON pour l'API
    });

    if (response.ok) {
      router.push("/login"); // Redirection vers la page de connexion en cas de succès
    } else {
      const data = await response.json(); // Récupère les données d'erreur de l'API
      setError(data.message || "Erreur lors de l'inscription"); // Affiche le message d'erreur
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Titre du formulaire */}
      <h1 className="text-2xl font-bold mb-4">Inscription</h1>

      {/* Formulaire */}
      <form onSubmit={handleSignup} className="bg-white p-6 rounded-lg shadow-md w-96">
        {/* Champ email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Champ mot de passe */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          S'inscrire
        </button>
      </form>

      {/* Message d'erreur */}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}

