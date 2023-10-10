import { AuthContext } from '@layout/context/AuthContext';
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuth } = useContext(AuthContext);
  let location = useLocation();

  if (!isAuth) {
    // Redirect them to the workflow public view page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    const redirectToPublic = `/public${location.pathname}`;
    return <Navigate to={redirectToPublic} state={{ from: location }} />;
  }

  return children;
}

export default RequireAuth;
