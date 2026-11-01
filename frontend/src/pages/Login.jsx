import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      navigate(data.role === 'ROLE_ADMIN' ? '/admin' : '/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş başarısız.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420, marginTop: 80 }}>
      <h3 className="mb-4 text-center">Staj Evrak Sistemi</h3>
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        <input
          type="email"
          className="form-control mb-3"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>
      <p className="text-center mt-3">
        Hesabın yok mu? <Link to="/register">Kayıt ol</Link>
      </p>
    </div>
  );
}