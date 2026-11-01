import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user.role === 'ROLE_ADMIN';

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
      <span className="navbar-brand">Staj Evrak Sistemi</span>

      <div className="navbar-nav me-auto">
        {isAdmin ? (
          <>
            <Link className="nav-link" to="/admin">Başvurular</Link>
            <Link className="nav-link" to="/admin/completed">Tamamlandı</Link>
            <Link className="nav-link" to="/admin/dataset">Veri Seti</Link>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/student">Ana Sayfa</Link>
            <Link className="nav-link" to="/student/upload">Evrak Yükle</Link>
          </>
        )}
      </div>

      <span className="text-light me-3">{user.fullName}</span>
      <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
        Çıkış
      </button>
    </nav>
  );
}