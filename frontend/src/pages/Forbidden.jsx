import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Forbidden() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate('/login'), 3000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="container mt-5 text-center">
      <h3>403 - Yetkiniz yok</h3>
      <p>3 saniye içinde giriş sayfasına yönlendiriliyorsunuz...</p>
    </div>
  );
}