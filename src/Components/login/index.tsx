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
    <div>
      {/* Titre de la page */}
      <h1>Connexion</h1>

      {/* Formulaire */}
      <form onSubmit={handleLogin}>
        {/* Champ email */}
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Champ mot de passe */}
        <div>
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Bouton de connexion */}
        <button type="submit">Se connecter</button>
      </form>

      {/* Message d'erreur */}
      {error && <p>{error}</p>}
    </div>
  );
}
