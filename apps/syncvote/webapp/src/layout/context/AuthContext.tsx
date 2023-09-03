import React from 'react';
import { Session } from '@supabase/gotrue-js';

type AuthProps = {
  session: Session | null;
};

export const AuthContext = React.createContext<AuthProps>({
  session: null,
});
