import React, { useContext, useState, useEffect } from "react";
import axios from "axios";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [localProducts, setLocalProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [editPrices, setEditPrices] = useState({});
  const [editingId, setEditingId] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    image: "",
    category: "",
    new_price: "",
    old_price: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/all_products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (Array.isArray(products)) {
      const sorted = [...products].reverse();
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
      setNewProduct({ name: "", image: "", category: "", new_price: "", old_price: "" });
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const handlePriceEdit = (id, field, value) => {
    setEditPrices((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSavePrice = async (id) => {
    const updated = editPrices[id];
    if (!updated.new_price || !updated.old_price) {
      alert("Please fill both price fields");
      return;
    }

    try {
      await axios.patch(`http://localhost:3000/all_products/${id}`, {
        new_price: updated.new_price,
        old_price: updated.old_price,
      });

      setLocalProducts((prev) =>
        prev.map((product) =>
          product.id === id
            ? { ...product, new_price: updated.new_price, old_price: updated.old_price }
            : product
        )
      );

      setEditingId(null);
    } catch (err) {
      console.error("Failed to update prices:", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">Manage Products</h2>

      {/* Add Product */}
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
          <div key={item.id} className="bg-white p-4 rounded shadow">
            <img
              src={item.image}
              alt={item.name}
              className="h-48 w-full object-contain mb-2"
            />
            <h3 className="font-bold text-lg">{item.name}</h3>
            <p className="text-sm text-gray-500 mb-1">Category: {item.category}</p>

            {editingId === item.id ? (
              <>
                <input
                  type="number"
                  placeholder="New Price"
                  className="border p-1 rounded mb-1 w-full"
                  value={editPrices[item.id]?.new_price || ""}
                  onChange={(e) =>
                    handlePriceEdit(item.id, "new_price", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Old Price"
                  className="border p-1 rounded mb-2 w-full"
                  value={editPrices[item.id]?.old_price || ""}
                  onChange={(e) =>
                    handlePriceEdit(item.id, "old_price", e.target.value)
                  }
                />
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded mr-2"
                  onClick={() => handleSavePrice(item.id)}
                >
                  Save
                </button>
                <button
                  className="px-3 py-1 bg-gray-400 text-white rounded"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p className="text-green-600 font-semibold">₹{item.new_price}</p>
                <p className="line-through text-red-500 mb-2">₹{item.old_price}</p>
                <button
                  className="px-3 py-1 bg-yellow-500 text-white rounded mr-2 hover:bg-yellow-600"
                  onClick={() => {
                    setEditingId(item.id);
                    setEditPrices((prev) => ({
                      ...prev,
                      [item.id]: {
                        new_price: item.new_price,
                        old_price: item.old_price,
                      },
                    }));
                  }}
                >
                  Edit Price
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDelete(item.id)}
                >
                  Remove
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Load More */}
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
