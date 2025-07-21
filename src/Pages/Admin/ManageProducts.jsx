import React, { useContext, useState, useEffect } from "react";
import ShopContext from "../../Context/ShopContext";
import axios from "axios";

function ManageProducts() {
  const products = useContext(ShopContext);
  const [localProducts, setLocalProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);

  const [newProduct, setNewProduct] = useState({
    name: "",
    image: "",
    category: "",
    new_price: "",
    old_price: ""
  });

  // On products update, reverse and store locally
  useEffect(() => {
    if (Array.isArray(products)) {
      const sorted = [...products].reverse(); // newest first
      setLocalProducts(sorted);
    }
  }, [products]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/all_products/${id}`);
      setLocalProducts((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleAddProduct = async () => {
    const { name, image, category, new_price, old_price } = newProduct;
    if (!name || !image || !category || !new_price || !old_price) {
      alert("Fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/all_products", newProduct);
      setLocalProducts((prev) => [res.data, ...prev]);
      setNewProduct({
        name: "",
        image: "",
        category: "",
        new_price: "",
        old_price: ""
      });
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
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
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Image URL"
            className="border p-2 rounded"
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
          />
          <input
            type="text"
            placeholder="Category"
            className="border p-2 rounded"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          />
          <input
            type="number"
            placeholder="New Price"
            className="border p-2 rounded"
            value={newProduct.new_price}
            onChange={(e) => setNewProduct({ ...newProduct, new_price: e.target.value })}
          />
          <input
            type="number"
            placeholder="Old Price"
            className="border p-2 rounded"
            value={newProduct.old_price}
            onChange={(e) => setNewProduct({ ...newProduct, old_price: e.target.value })}
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
        {localProducts.slice(0, visibleCount).map((item) => (
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
            <p className="text-sm text-gray-500 mb-1">Category: {item.category}</p>
            <p className="text-green-600 font-semibold">₹{item.new_price}</p>
            <p className="line-through text-red-500 mb-2">₹{item.old_price}</p>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => handleDelete(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {visibleCount < localProducts.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default ManageProducts;
