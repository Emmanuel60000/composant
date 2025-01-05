"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUserAndReservations = async () => {
      try {
        // Récupère l'utilisateur
        const userResponse = await fetch("/api/protected", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData.user);
        } else {
          router.push("/login");
        }

        // Récupère les réservations
        const reservationsResponse = await fetch("/api/reservations/history", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (reservationsResponse.ok) {
          const reservationsData = await reservationsResponse.json();
          setReservations(reservationsData);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndReservations();
  }, [router]);

  if (loading) {
    return <p className="text-center text-lg">Chargement...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Bienvenue sur le Dashboard</h1>
      {user && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <p className="text-lg">
            Bonjour, <span className="font-bold">{user.email}</span> !
          </p>
          <p className="mt-4">ID utilisateur : {user.id}</p>
        </div>
      )}

      <button
        onClick={() => router.push("/reservations")}
        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out text-center hover:opacity-90 mb-6"
      >
        Créer une réservation
      </button>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Historique des réservations</h2>
        {reservations.length > 0 ? (
          <ul className="space-y-4">
            {reservations.map((reservation) => (
              <li
                key={reservation.id}
                className="p-4 border border-gray-300 rounded-md shadow-sm"
              >
                <p>
                  <strong>Restaurant :</strong> {reservation.restaurant}
                </p>
                <p>
                  <strong>Date :</strong> {new Date(reservation.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Heure :</strong> {reservation.time}
                </p>
                <p>
                  <strong>Nombre de personnes :</strong> {reservation.numberOfPeople}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">Aucune réservation trouvée.</p>
        )}
      </div>
    </div>
  );
}
