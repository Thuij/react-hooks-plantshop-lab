import React, { useEffect, useState } from "react";

function App() {
  const [plants, setPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInStock, setShowInStock] = useState(false);

  const [plantName, setPlantName] = useState("");
  const [plantPrice, setPlantPrice] = useState("");
  const [plantImage, setPlantImage] = useState("");

  // 1. Fetch all plants
  useEffect(() => {
    fetch("http://localhost:6001/plants")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch plants");
        }
        return response.json();
      })
      .then((data) => {
        const updatedPlants = data.map((plant) => ({
          ...plant,
          inStock: plant.inStock ?? true,
        }));

        setPlants(updatedPlants);
      })
      .catch((error) => console.error("Error fetching plants:", error));
  }, []);

  // 2. Add a new plant
  const handleSubmit = (event) => {
    event.preventDefault();

    const newPlant = {
      name: plantName,
      image: plantImage,
      price: plantPrice,
    };

    fetch("http://localhost:6001/plants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPlant),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add plant");
        }
        return response.json();
      })
      .then((data) => {
        setPlants((previousPlants) => [
          ...previousPlants,
          { ...data, inStock: data.inStock ?? true },
        ]);

        setPlantName("");
        setPlantPrice("");
        setPlantImage("");
      })
      .catch((error) => console.error("Error adding plant:", error));
  };

  // 3. Toggle stock status
  const handleStockToggle = (plant) => {
    const updatedStock = !plant.inStock;

    // Update the screen immediately
    setPlants((previousPlants) =>
      previousPlants.map((item) =>
        item.id === plant.id
          ? { ...item, inStock: updatedStock }
          : item
      )
    );

    // Update the backend
    fetch(`http://localhost:6001/plants/${plant.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inStock: updatedStock,
      }),
    }).catch((error) => console.error("Error updating stock:", error));
  };

  // 4. Search and filter plants
  const filteredPlants = plants.filter((plant) => {
    const matchesSearch = plant.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStock = !showInStock || plant.inStock === true;

    return matchesSearch && matchesStock;
  });

  return (
    <div>
      <h1>Plant Shop</h1>

      <h2>All Plants</h2>

      <input
        type="text"
        placeholder="Type a name to search..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      <br />

      <label>
        <input
          type="checkbox"
          checked={showInStock}
          onChange={(event) => setShowInStock(event.target.checked)}
        />
        Show In Stock
      </label>

      <div>
        {filteredPlants.map((plant) => (
          <div data-testid="plant-item" key={plant.id}>
            <h4>{plant.name}</h4>

            <img
              src={plant.image}
              alt={plant.name}
            />

            <p>Price: {plant.price}</p>

            <button
              type="button"
              onClick={() => handleStockToggle(plant)}
            >
              {plant.inStock ? "In Stock" : "Out of Stock"}
            </button>
          </div>
        ))}
      </div>

      <h2>Create Plant</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Plant name"
          value={plantName}
          onChange={(event) => setPlantName(event.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={plantPrice}
          onChange={(event) => setPlantPrice(event.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Image URL"
          value={plantImage}
          onChange={(event) => setPlantImage(event.target.value)}
          required
        />

        <button type="submit">Add Plant</button>
      </form>
    </div>
  );
}

export default App;