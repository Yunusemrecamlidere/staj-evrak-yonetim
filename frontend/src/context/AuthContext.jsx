import { createContext, useContext, useState } from 'react';
// import api from '../api/axios';

const AuthContext = createContext();
let failCount = 0; // sadece mock için

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // GEÇİCİ MOCK: backend hazır olunca şunla değiştir:
  // const { data } = await api.post('/auth/login', { username, password });
  const login = async (username, password) => {
    if (password === 'yanlis') {
      failCount += 1;
      if (failCount >= 5) {
        throw { response: { status: 423, data: { message: '5 hatalı deneme yapıldı, hesabınız kilitlendi.' } } };
      }
      throw { response: { status: 401, data: { message: `Hatalı kullanıcı adı veya şifre (${failCount}/5)` } } };
    }
    failCount = 0;
    const data = {
      token: 'fake-token',
      role: username.includes('admin') ? 'ROLE_ADMIN' : 'ROLE_STUDENT',
      fullName: 'Test Kullanıcı',
      email: username,
    };
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = async () => {
    try {
      // await api.post('/auth/logout'); // backend token'ı geçersiz kılsın, hazır olunca aç
    } catch {
      // backend'e ulaşılamasa da yerel oturum silinecek
    }
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