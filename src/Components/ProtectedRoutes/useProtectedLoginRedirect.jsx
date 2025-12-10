// src/hooks/useProtectedLoginRedirect.jsx
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

export default function useProtectedLoginRedirect() {
  const user = useSelector((s) => s.auth?.user);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!user) return;

    // Admins -> admin dashboard (unless already there)
    if (user.is_staff || user.is_superuser) {
      if (!pathname.startsWith("/admin")) navigate("/admin", { replace: true });
      return;
    }

    // Normal users -> site home (avoid redirect loop)
    if (pathname !== "/") navigate("/", { replace: true });
  }, [user, navigate, pathname]);
}
