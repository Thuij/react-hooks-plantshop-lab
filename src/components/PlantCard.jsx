import React from "react";

function PlantCard({ plant, onSoldOut }) {
  return (
    <div className="plant-card">
      <img
        src={plant.image}
        alt={plant.name}
        className="plant-image"
      />

      <h3>{plant.name}</h3>

      <p>Price: ${plant.price}</p>

      <button
        onClick={() => onSoldOut(plant.id)}
        disabled={plant.soldOut}
      >
        {plant.soldOut ? "Sold Out" : "In Stock"}
      </button>
    </div>
  );
}

export default PlantCard;