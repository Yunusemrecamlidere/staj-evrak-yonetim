import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // GEÇİCİ MOCK: backend hazır olunca gerçek api.post('/auth/login') ile değiştirilecek
  const login = async (email, password) => {
    const data = {
      token: 'fake-token',
      role: email.includes('admin') ? 'ROLE_ADMIN' : 'ROLE_STUDENT',
      fullName: 'Test Kullanıcı',
      email,
    };
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);