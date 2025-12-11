import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser, toggleBanUser, setPageSize } from "../../Redux/Slices/adminUserSlice.jsx";

function ManageUsers() {
  const dispatch = useDispatch();
  const { items: users, loading, error, meta } = useSelector((s) => s.adminUsers);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(meta.page || 1);
  const [pageSizeLocal, setPageSizeLocal] = useState(meta.page_size || 10);

  const load = useCallback(() => {
    dispatch(fetchUsers({ page, page_size: pageSizeLocal, search }));
  }, [dispatch, page, pageSizeLocal, search]);

  // initial load and when deps change
  useEffect(() => {
    load();
  }, [load]);

  // debounced search: small debounce
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      dispatch(fetchUsers({ page: 1, page_size: pageSizeLocal, search }));
    }, 300);
    return () => clearTimeout(t);
  }, [search, dispatch, pageSizeLocal]);

  useEffect(() => {
    // keep local page in sync with meta.page after fetch
    setPage(meta.page || 1);
  }, [meta.page]);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    dispatch(deleteUser(id)).then(() => {
      // after delete, reload current page to keep data correct
      // if current page empties, reducer logic handled count; we simply reload
      dispatch(fetchUsers({ page, page_size: pageSizeLocal, search }));
    });
  };

  const handleToggleBan = (id) => {
    dispatch(toggleBanUser(id));
  };

  const gotoPage = (p) => {
    if (p < 1) return;
    const totalPages = Math.max(1, Math.ceil((meta.count || 0) / pageSizeLocal));
    if (p > totalPages) return;
    setPage(p);
    dispatch(fetchUsers({ page: p, page_size: pageSizeLocal, search }));
  };

  const changePageSize = (size) => {
    setPageSizeLocal(size);
    dispatch(setPageSize(size));
    setPage(1);
    dispatch(fetchUsers({ page: 1, page_size: size, search }));
  };

  const totalPages = Math.max(1, Math.ceil((meta.count || 0) / pageSizeLocal));

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4 gap-4">
        <h2 className="text-xl font-semibold">All Users</h2>

        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone"
            className="px-3 py-2 border rounded"
          />
          <select
            value={pageSizeLocal}
            onChange={(e) => changePageSize(Number(e.target.value))}
            className="px-2 py-2 border rounded"
          >
            {[5, 10, 20, 50].map((s) => (
              <option key={s} value={s}>
                {s} / page
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">Error: {String(error)}</div>}

      {/* Mobile */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded shadow p-4 flex flex-col gap-2">
            <div>
              <span className="font-semibold">Name: </span>
              {user.name}
            </div>
            <div>
              <span className="font-semibold">Email: </span>
              {user.email}
            </div>
            <div>
              <span className="font-semibold">Phone: </span>
              {user.phone_number}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <button
                onClick={() => handleToggleBan(user.id)}
                className={`px-3 py-1 rounded text-white ${user.is_banned ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"}`}
              >
                {user.is_banned ? "Unban" : "Ban"}
              </button>
              <button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full bg-white rounded shadow min-w-[700px]">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Banned</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.phone_number}</td>
                <td className="p-3">{user.is_banned ? "Yes" : "No"}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleToggleBan(user.id)}
                      className={`px-3 py-1 rounded text-white ${user.is_banned ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"}`}
                    >
                      {user.is_banned ? "Unban" : "Ban"}
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div>
          Page {page} of {totalPages}, total {meta.count || 0}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => gotoPage(1)} disabled={page <= 1} className="px-2 py-1 border rounded disabled:opacity-50">
            First
          </button>
          <button onClick={() => gotoPage(page - 1)} disabled={page <= 1} className="px-2 py-1 border rounded disabled:opacity-50">
            Prev
          </button>

          <span className="px-2">{page}</span>

          <button onClick={() => gotoPage(page + 1)} disabled={page >= totalPages} className="px-2 py-1 border rounded disabled:opacity-50">
            Next
          </button>
          <button onClick={() => gotoPage(totalPages)} disabled={page >= totalPages} className="px-2 py-1 border rounded disabled:opacity-50">
            Last
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
