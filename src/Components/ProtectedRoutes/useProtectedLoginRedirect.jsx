import { useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../Context/AuthContext';

function useProtectedLoginRedirect() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);
}

export default useProtectedLoginRedirect;
