'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext<any>({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const res = await fetch('/api/auth/me');
    if (!res.ok) {
      setUser(null);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setUser(data.user);
    setLoading(false);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, refresh, signOut }}>{children}</AuthContext.Provider>;
};
