// src/pages/admin/ManageOrders.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminOrders,
  changeAdminOrderStatus,
  fetchAdminOrderDetail,
  setPage,
  setPageSize,
  setSearch,
} from "../../Redux/Slices/adminOrdersSlice.jsx";
import toast, { Toaster } from "react-hot-toast";

export default function ManageOrders() {
  const dispatch = useDispatch();
  const {
    items: orders,
    loading,
    error,
    page,
    pageSize,
    total,
    search,
    ordering,
  } = useSelector((state) => state.adminOrders);

  const [localSearch, setLocalSearch] = useState(search || "");

  useEffect(() => {
    dispatch(fetchAdminOrders({ page, pageSize, search, ordering }));
  }, [dispatch, page, pageSize, search, ordering]);

  useEffect(() => {
    if (error) {
      const msg = typeof error === "string" ? error : (error.detail || "Something went wrong");
      toast.error(msg);
    }
  }, [error]);

  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));

  function onSearchSubmit(e) {
    e.preventDefault();
    dispatch(setSearch(localSearch.trim()));
  }

  function handleStatusChange(orderId, value) {
    toast.promise(
      dispatch(changeAdminOrderStatus({ orderId, status: value })).unwrap(),
      {
        loading: "Updating status...",
        success: (res) => `Order #${res.id} status updated to ${res.order_status}`,
        error: (err) => err?.detail || "Failed to update status",
      }
    );
  }

  function openOrder(orderId) {
    dispatch(fetchAdminOrderDetail(orderId));
    // show modal or route to detail page. This example just fetches and keeps in slice.selectedOrder
  }

  return (
    <div className="p-4 md:p-6">
      <Toaster />
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Order Management</h2>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <form onSubmit={onSearchSubmit} className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          <div className="flex-1 w-full">
            <input
              type="text"
              placeholder="Search by order ID, user email, or username"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Search
            </button>
            <select
              value={pageSize}
              onChange={(e) => dispatch(setPageSize(Number(e.target.value)))}
              className="px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
            </select>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <div className="text-gray-400 text-5xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Items
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Payment
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((o) => (
                  <tr 
                    key={o.id} 
                    className="hover:bg-gray-50 transition duration-150 cursor-pointer"
                    onClick={() => openOrder(o.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-blue-600">#{o.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{o.user?.name || "Guest"}</div>
                      <div className="text-sm text-gray-500">{o.user?.email || "No email"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {o.items?.length ?? 0} item{o.items?.length > 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">₹{o.total_amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                        o.payment_status === "PAID" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {o.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={o.order_status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="PROCESSING" className="text-yellow-600">PROCESSING</option>
                        <option value="SHIPPED" className="text-blue-600">SHIPPED</option>
                        <option value="DELIVERED" className="text-green-600">DELIVERED</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(o.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700">
          Showing page <span className="font-semibold">{page}</span> of{" "}
          <span className="font-semibold">{Math.max(1, Math.ceil((total || 0) / pageSize))}</span> •{" "}
          <span className="font-semibold">{total || 0}</span> total orders
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => dispatch(setPage(Math.max(1, page - 1)))}
            disabled={page <= 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            Previous
          </button>
          <button
            onClick={() => dispatch(setPage(Math.min(Math.max(1, Math.ceil((total || 0) / pageSize)), page + 1)))}
            disabled={page >= Math.ceil((total || 0) / pageSize)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}