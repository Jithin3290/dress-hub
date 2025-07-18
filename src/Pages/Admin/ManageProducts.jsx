// src/Pages/Admin/ManageProducts.jsx
import React, { useContext, useState, useEffect } from "react";
import ShopContext from "../../Context/ShopContext";
import axios from "axios";

function ManageProducts() {
  const products = useContext(ShopContext);
  const [localProducts, setLocalProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    image: "",
    new_price: "",
  });

  // On products update, reverse and store locally
  useEffect(() => {
    if (Array.isArray(products)) {
      const sorted = [...products].reverse(); // show newest first
      setLocalProducts(sorted);
    }
  }, [products]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/data/${id}`);
      setLocalProducts(localProducts.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.image || !newProduct.new_price) {
      alert("Fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/data", newProduct);
      setLocalProducts([res.data, ...localProducts]);
      setNewProduct({ name: "", image: "", new_price: "" });
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">Manage Products</h2>

      {/* Add Product Section */}
      <div className="mb-6 bg-gray-50 p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">Add New Product</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            className="border p-2 rounded"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Image URL"
            className="border p-2 rounded"
            value={newProduct.image}
            onChange={(e) =>
              setNewProduct({ ...newProduct, image: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Price"
            className="border p-2 rounded"
            value={newProduct.new_price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, new_price: e.target.value })
            }
          />
        </div>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleAddProduct}
        >
          Add Product
        </button>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {localProducts.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded shadow hover:shadow-lg transition"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-48 w-full object-contain mb-2"
            />
            <h3 className="font-bold text-lg">{item.name}</h3>
            <p className="text-green-600 font-semibold mb-2">
              ₹{item.new_price}
            </p>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => handleDelete(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageProducts;
