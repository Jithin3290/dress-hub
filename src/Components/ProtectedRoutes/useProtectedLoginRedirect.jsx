import { useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

function useProtectedLoginRedirect() {
  const auth = useSelector((s) => s.auth || {});
  const user = auth.user;
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);
}

export default useProtectedLoginRedirect;
