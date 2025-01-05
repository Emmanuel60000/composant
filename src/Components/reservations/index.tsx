"use client";

import { useState } from "react";

export default function Reservations() {
  const [restaurant, setRestaurant] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Vous devez être connecté pour effectuer une réservation.");
      return;
    }

    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ restaurant, date, time, numberOfPeople }),
    });

    if (response.ok) {
      setMessage("Réservation créée avec succès !");
    } else {
      setMessage("Erreur lors de la création de la réservation.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Créer une réservation</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
        <input
          type="text"
          placeholder="Restaurant"
          value={restaurant}
          onChange={(e) => setRestaurant(e.target.value)}
          className="mb-4 w-full border border-gray-300 rounded-md p-2"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mb-4 w-full border border-gray-300 rounded-md p-2"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="mb-4 w-full border border-gray-300 rounded-md p-2"
        />
        <input
          type="number"
          placeholder="Nombre de personnes"
          value={numberOfPeople}
          onChange={(e) => setNumberOfPeople(Number(e.target.value))}
          min="1"
          className="mb-4 w-full border border-gray-300 rounded-md p-2"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
          Réserver
        </button>
      </form>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
}
