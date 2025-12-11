// src/hooks/useProtectedLoginRedirect.jsx
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

function readUserFallback() {
  try {
    const raw = sessionStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function useProtectedLoginRedirect() {
  const reduxUser = useSelector((s) => s.auth?.user);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const user = reduxUser || readUserFallback();
    if (!user) return;

    const isAdmin = !!user.is_staff || !!user.is_superuser;
    // Admins go to /admin unless already inside admin routes
    if (isAdmin) {
      if (!pathname.startsWith("/admin")) navigate("/admin", { replace: true });
      return;
    }

    // Normal users go to home, avoid redirect loop
    if (pathname !== "/") navigate("/", { replace: true });
  }, [reduxUser, navigate, pathname]);
}
