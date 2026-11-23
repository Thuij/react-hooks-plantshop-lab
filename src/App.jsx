import React, { useState, useEffect } from "react";

function App() {
  const [plants, setPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch plants from backend
  useEffect(() => {
    fetch("http://localhost:6001/plants")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch plants");
        }
        return response.json();
      })
      .then((data) => setPlants(data))
      .catch((error) => console.error(error));
  }, []);

  // Add a plant
  function handleAddPlant(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const newPlant = {
      name: formData.get("name"),
      image: formData.get("image"),
      price: Number(formData.get("price")),
      soldOut: false,
    };

    fetch("http://localhost:6001/plants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPlant),
    })
      .then((response) => response.json())
      .then((plant) => {
        setPlants((currentPlants) => [...currentPlants, plant]);
        event.target.reset();
      })
      .catch((error) => console.error(error));
  }

  // Mark plant as sold out
  function handleSoldOut(id) {
    setPlants((currentPlants) =>
      currentPlants.map((plant) =>
        plant.id === id
          ? { ...plant, soldOut: true }
          : plant
      )
    );
  }

  // Search plants
  const filteredPlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <h1>Plant Shop</h1>

      <input
        type="text"
        placeholder="Search plants..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      <h2>Add a New Plant</h2>

      <form onSubmit={handleAddPlant}>
        <input name="name" placeholder="Plant name" required />
        <input name="image" placeholder="Image URL" required />
        <input
          name="price"
          type="number"
          placeholder="Price"
          required
        />
        <button type="submit">Add Plant</button>
      </form>

      <h2>Available Plants</h2>

      <div className="plant-container">
        {filteredPlants.map((plant) => (
          <div className="plant-card" key={plant.id}>
            <img src={plant.image} alt={plant.name} width="150" />

            <h3>{plant.name}</h3>

            <p>Price: ${plant.price}</p>

            <button
              onClick={() => handleSoldOut(plant.id)}
              disabled={plant.soldOut}
            >
              {plant.soldOut ? "Sold Out" : "In Stock"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
