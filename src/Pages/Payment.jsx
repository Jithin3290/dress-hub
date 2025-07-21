import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const navigate = useNavigate();

  const handlePayment = () => {
    toast.success(`Payment successful via ${paymentMethod.toUpperCase()}`);
    setTimeout(() => {
      navigate("/order");
    }, 1000);
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="text-2xl font-bold mb-6 text-center">Choose Payment</h2>

      <div className="space-y-4">
        <label className="block">
          <input
            type="radio"
            name="payment"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={() => setPaymentMethod("cod")}
            className="mr-2"
          />
          Cash on Delivery
        </label>

        <label className="block">
          <input
            type="radio"
            name="payment"
            value="online"
            checked={paymentMethod === "online"}
            onChange={() => setPaymentMethod("online")}
            className="mr-2"
          />
          Online Payment
        </label>
      </div>

      <button
        onClick={handlePayment}
        className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
      >
        Confirm Payment
      </button>
    </div>
  );
}

export default Payment;
