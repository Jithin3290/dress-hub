// src/pages/admin/ManageProducts.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminProducts,
  createAdminProduct,
  patchAdminProduct,
  deleteAdminProduct,
  setPage,
  setPageSize,
  setSearch,
} from "../../Redux/Slices/adminProductsSlice.jsx";
import adminApi from "../../admin_api";
import toast, { Toaster } from "react-hot-toast";

export default function ManageProducts() {
  const dispatch = useDispatch();
  const { items: products, loading, error, page, pageSize, total, search } = useSelector((s) => s.adminProducts);

  const [categories, setCategories] = useState([]);
  const [sizesList, setSizesList] = useState([]); // existing sizes from backend (optional)
  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category_id: "",
    new_price: "",
    old_price: "",
    sizes_input: [], // array of strings
    stock: "",
  });

  const [sizeInputText, setSizeInputText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editPrice, setEditPrice] = useState({ new_price: "", old_price: "" });

  useEffect(() => {
    adminApi.get("categories/").then((res) => setCategories(res.data)).catch(()=>{});
    adminApi.get("sizes/").then((res) => setSizesList(res.data)).catch(()=>{});
  }, []);

  useEffect(() => {
    dispatch(fetchAdminProducts({ page, pageSize, search }));
  }, [dispatch, page, pageSize, search]);

  useEffect(() => {
    if (error) toast.error(typeof error === "string" ? error : (error?.detail || "Something went wrong"));
  }, [error]);

  function handleForm(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function addSizeTag() {
    const raw = (sizeInputText || "").trim();
    if (!raw) return;
    const normalized = raw.toUpperCase();
    if (!form.sizes_input.includes(normalized)) {
      setForm((p) => ({ ...p, sizes_input: [...p.sizes_input, normalized] }));
    }
    setSizeInputText("");
  }

  function removeSizeTag(idx) {
    setForm((p) => ({ ...p, sizes_input: p.sizes_input.filter((_, i) => i !== idx) }));
  }

  function onFileChange(e) {
    setImageFile(e.target.files?.[0] ?? null);
  }

  async function submitForm(e) {
    e.preventDefault();
    if (!form.name || !form.category_id || !form.new_price) {
      toast.error("Name, category and new price are required");
      return;
    }
    if (form.sizes_input.length === 0) {
      toast.error("Add at least one size");
      return;
    }
    if (!form.stock) {
      toast.error("Stock required");
      return;
    }

    const payload = {
      name: form.name,
      category_id: form.category_id,
      new_price: form.new_price,
      old_price: form.old_price || null,
      sizes_input: form.sizes_input, // array of strings
      stock: form.stock,
    };

    // append image file in thunk via createAdminProduct asFormData flag (thunk expects payload.image if file)
    if (imageFile) {
      payload.image = imageFile;
    }

    try {
      await toast.promise(
        dispatch(createAdminProduct({ payload, asFormData: !!imageFile })).unwrap(),
        {
          loading: "Creating...",
          success: () => {
            setForm({ name: "", category_id: "", new_price: "", old_price: "", sizes_input: [], stock: "" });
            setImageFile(null);
            dispatch(fetchAdminProducts({ page: 1, pageSize, search }));
            return "Created";
          },
          error: (err) => err?.detail || "Failed",
        }
      );
    } catch (err) {}
  }

  function startEdit(p) {
    setEditId(p.id);
    setEditPrice({ new_price: p.new_price, old_price: p.old_price || "" });
  }

  async function savePrice(id) {
    try {
      await toast.promise(dispatch(patchAdminProduct({ id, patch: { new_price: editPrice.new_price, old_price: editPrice.old_price } })).unwrap(), {
        loading: "Saving...", success: "Saved", error: "Failed",
      });
      setEditId(null);
    } catch {}
  }

  async function remove(id) {
    if (!window.confirm("Delete product?")) return;
    try {
      await toast.promise(dispatch(deleteAdminProduct(id)).unwrap(), { loading: "Deleting...", success: "Deleted", error: "Failed" });
    } catch {}
  }

  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));

  return (
    <div className="p-4">
      <Toaster />
      <h2 className="text-2xl font-semibold mb-4">Manage Products</h2>

      <form onSubmit={(e)=>{ e.preventDefault(); dispatch(setSearch(e.target.search.value.trim())); }} className="flex gap-2 mb-4">
        <input name="search" defaultValue={search} placeholder="Search..." className="border p-2 rounded w-full" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
        <select value={pageSize} onChange={(e)=>dispatch(setPageSize(Number(e.target.value)))} className="border p-2 rounded">
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </form>

      <form onSubmit={submitForm} className="bg-gray-50 p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input value={form.name} onChange={(e)=>handleForm("name", e.target.value)} placeholder="Name" className="border p-2 rounded" />
          <select value={form.category_id} onChange={(e)=>handleForm("category_id", e.target.value)} className="border p-2 rounded">
            <option value="">Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input type="number" value={form.new_price} onChange={(e)=>handleForm("new_price", e.target.value)} placeholder="New price" className="border p-2 rounded" />
          <input type="number" value={form.old_price} onChange={(e)=>handleForm("old_price", e.target.value)} placeholder="Old price (optional)" className="border p-2 rounded" />
          <input type="number" value={form.stock} onChange={(e)=>handleForm("stock", e.target.value)} placeholder="Stock (applies to sizes)" className="border p-2 rounded" />
          <input type="file" accept="image/*" onChange={onFileChange} className="border p-2 rounded" />
        </div>

        <div className="mt-4">
          <label className="block mb-2 font-semibold">Sizes (type and press Enter)</label>
          <div className="flex gap-2 mb-2">
            <input value={sizeInputText} onChange={(e)=>setSizeInputText(e.target.value)} onKeyDown={(e)=>{ if(e.key==="Enter"){ e.preventDefault(); addSizeTag(); }}} placeholder="e.g. S or XL or 28" className="border p-2 rounded flex-1" />
            <button type="button" onClick={addSizeTag} className="px-3 py-1 bg-blue-600 text-white rounded">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.sizes_input.map((t,i) => (
              <div key={t} className="inline-flex items-center gap-2 bg-gray-100 px-2 py-1 rounded">
                <span>{t}</span>
                <button type="button" onClick={() => removeSizeTag(i)} className="text-red-500">x</button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Create Product</button>
        </div>
      </form>

      {loading ? <div>Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map(p => (
            <div key={p.id} className="border p-4 rounded shadow bg-white">
              {p.image_url ? <img src={p.image_url} alt={p.name} className="h-48 w-full object-contain mb-2" /> : null}
              <h3 className="font-bold">{p.name}</h3>
              <p className="text-sm text-gray-600">{p.category?.name}</p>

              {editId === p.id ? (
                <>
                  <input type="number" value={editPrice.new_price} onChange={(e)=>setEditPrice(s=>({...s,new_price:e.target.value}))} className="border p-2 rounded w-full mt-2" />
                  <input type="number" value={editPrice.old_price} onChange={(e)=>setEditPrice(s=>({...s,old_price:e.target.value}))} className="border p-2 rounded w-full mt-2" />
                  <div className="flex gap-2 mt-3">
                    <button onClick={()=>savePrice(p.id)} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                    <button onClick={()=>setEditId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-green-600 font-semibold mt-2">₹{p.new_price}</div>
                  <div className="text-red-500 line-through mb-2">₹{p.old_price}</div>
                  <div className="flex gap-2">
                    <button onClick={()=>startEdit(p)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                    <button onClick={()=>remove(p.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                  </div>
                </>
              )}

              <div className="mt-3 text-sm text-gray-600">
                Sizes: {p.sizes && p.sizes.length ? p.sizes.map(s => `${s.size_name}(${s.stock})`).join(", ") : "None"}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-between items-center">
        <div>Page {page} of {totalPages}</div>
        <div className="flex gap-2">
          <button disabled={page<=1} onClick={()=>dispatch(setPage(page-1))} className="px-3 py-1 border rounded">Prev</button>
          <button disabled={page>=totalPages} onClick={()=>dispatch(setPage(page+1))} className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>
    </div>
  );
}
