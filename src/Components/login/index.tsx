"use client"; // Indique que ce composant est un composant client (utilisé dans l'App Router de Next.js).

import { useState } from "react"; // J'importe le hook useState pour gérer les états locaux.
import { useRouter } from "next/navigation"; // J'importe useRouter pour rediriger l'utilisateur après la connexion.

export default function Login() {
  // États locaux pour gérer l'email, le mot de passe, et les erreurs
  const [email, setEmail] = useState(""); // Stocke l'email saisi par l'utilisateur
  const [password, setPassword] = useState(""); // Stocke le mot de passe saisi par l'utilisateur
  const [error, setError] = useState(""); // Stocke le message d'erreur éventuel
  const router = useRouter(); // Permet de rediriger l'utilisateur vers une autre page

  // Fonction pour gérer la soumission du formulaire de connexion
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page par défaut
    setError(""); // Réinitialise le message d'erreur

    // Envoi des informations de connexion à l'API
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Spécifie que les données envoyées sont au format JSON
      },
      body: JSON.stringify({ email, password }), // Convertit les données en chaîne JSON
    });

    if (response.ok) {
      const data = await response.json(); // Récupère les données de la réponse
      localStorage.setItem("token", data.token); // Stocke le token JWT dans le localStorage
      router.push("/dashboard"); // Redirige l'utilisateur vers une page protégée (tableau de bord)
    } else {
      const data = await response.json(); // Récupère le message d'erreur de la réponse
      setError(data.message || "Erreur lors de la connexion"); // Affiche un message d'erreur
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Titre de la page */}
      <h1 className="text-2xl font-bold mb-4">Connexion</h1>

      {/* Formulaire */}
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-96">
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

        {/* Bouton de connexion */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Se connecter
        </button>
      </form>

      {/* Message d'erreur */}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
