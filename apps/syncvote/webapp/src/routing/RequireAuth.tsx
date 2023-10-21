import { AuthContext } from '@layout/context/AuthContext';
import { useContext, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuth } = useContext(AuthContext);
  let location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuth) { // Check if the user is authenticated
      const lastVisitedPage = sessionStorage.getItem('lastVisitedPage');
      if (lastVisitedPage) {
        navigate(lastVisitedPage); // Navigate to the stored page
        sessionStorage.removeItem('lastVisitedPage'); // Clear the stored page
      } else {
        navigate('/'); // Default redirection if no stored page found
      }
    }
  }, [isAuth, navigate]);

  if (!isAuth) {
    // If user is not authenticated, store the current location
    sessionStorage.setItem('lastVisitedPage', location.pathname);

    const redirectToLogin = '/login';
    return <Navigate to={redirectToLogin} />;
  }

  return children;
}


export default RequireAuth;
