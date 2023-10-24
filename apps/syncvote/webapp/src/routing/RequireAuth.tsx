import App from '@App';
import WebLayoutWithoutSider from '@layout/WebLayoutWithoutSider';
import { AuthContext } from '@layout/context/AuthContext';
import { useContext, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeTemplate,
} from '@pages/Organization';

function RequireAuth({ children, homeTemplate }: { children: JSX.Element, homeTemplate?: JSX.Element }) {
  const { isAuth } = useContext(AuthContext);
  let location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      const lastVisitedPage = sessionStorage.getItem('lastVisitedPage');
      if (lastVisitedPage) {
        navigate(lastVisitedPage);
        sessionStorage.removeItem('lastVisitedPage');
      }
    }
  }, [isAuth, navigate]);

  // If user is at the root path and is not authenticated, show HomeTemplate
  if (!isAuth && location.pathname === '/') {
    return <WebLayoutWithoutSider><HomeTemplate /></WebLayoutWithoutSider>;
  }

  if (!isAuth) {
    sessionStorage.setItem('lastVisitedPage', location.pathname);
    const redirectToLogin = '/login';
    return <Navigate to={redirectToLogin} />;
  }

  return children;
}

export default RequireAuth;
