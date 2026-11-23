import React, { useState } from "react";

function NewPlantForm({ onAddPlant }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const newPlant = {
      name: name,
      image: image,
      price: Number(price),
      soldOut: false,
    };

    onAddPlant(newPlant);

    // Clear form after submission
    setName("");
    setImage("");
    setPrice("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a New Plant</h2>

      <label>Plant Name:</label>
      <input
        type="text"
        placeholder="Enter plant name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />

      <label>Image URL:</label>
      <input
        type="text"
        placeholder="Enter image URL"
        value={image}
        onChange={(event) => setImage(event.target.value)}
        required
      />

      <label>Price:</label>
      <input
        type="number"
        placeholder="Enter price"
        value={price}
        onChange={(event) => setPrice(event.target.value)}
        required
      />

      <button type="submit">Add Plant</button>
    </form>
  );
}

export default PlantForm;