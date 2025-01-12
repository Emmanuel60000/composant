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
    <div>
      <h1>Créer une réservation</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Restaurant"
          value={restaurant}
          onChange={(e) => setRestaurant(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <input
          type="number"
          placeholder="Nombre de personnes"
          value={numberOfPeople}
          onChange={(e) => setNumberOfPeople(Number(e.target.value))}
          min="1"
        />
        <button type="submit">Réserver</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
