import { useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

function Notification() {
  const wsRef = useRef(null);

  useEffect(() => {
    if (wsRef.current) return;

    const WS_BASE = import.meta.env.VITE_WS_URL;
    if (!WS_BASE) {
      throw new Error("VITE_WS_URL is not defined");
    }

    const ws = new WebSocket(`${WS_BASE}/ws/order/notifications/`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WS CONNECTED");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 WS:", data);

      if (data?.message) {
        toast(data.message, {
          icon: "🔔",
          duration: 4000,
        });
      }
    };

    ws.onerror = (err) => {
      console.error("❌ WS ERROR", err);
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, []);

  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        style: {
          fontSize: "14px",
        },
      }}
    />
  );
}

export default Notification;
