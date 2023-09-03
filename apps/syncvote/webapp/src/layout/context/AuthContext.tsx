import React from 'react';
import { Session } from '@supabase/gotrue-js';

type AuthProps = {
  session: Session | null;
  isAuth: boolean;
};

export const AuthContext = React.createContext<AuthProps>({
  isAuth: false,
  session: null,
});
