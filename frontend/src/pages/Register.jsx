import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import api from '../api/axios';

export default function Register() {
  const [form, setForm] = useState({
    fullName: '',
    studentNo: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!/^\d{6,12}$/.test(form.studentNo)) {
      setError('Öğrenci numarası sadece rakamlardan oluşmalı.');
      return;
    }
    if (form.password.length < 6) {
      setError('Şifre en az 6 karakter olmalı.');
      return;
    }
    if (form.password !== form.passwordConfirm) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    try {
      // GEÇİCİ MOCK: backend hazır olunca aç:
      // await api.post('/auth/register', {
      //   fullName: form.fullName, studentNo: form.studentNo,
      //   email: form.email, password: form.password,
      // });
      setSuccess('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt başarısız.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420, marginTop: 60 }}>
      <h3 className="mb-4 text-center">Kayıt Ol</h3>
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <input name="fullName" className="form-control mb-3" placeholder="Ad Soyad"
          value={form.fullName} onChange={handleChange} required />
        <input name="studentNo" className="form-control mb-3" placeholder="Öğrenci No"
          value={form.studentNo} onChange={handleChange} required />
        <input name="email" type="email" className="form-control mb-3" placeholder="E-posta"
          value={form.email} onChange={handleChange} required />
        <input name="password" type="password" className="form-control mb-3" placeholder="Şifre"
          value={form.password} onChange={handleChange} required />
        <input name="passwordConfirm" type="password" className="form-control mb-3"
          placeholder="Şifre (tekrar)" value={form.passwordConfirm} onChange={handleChange} required />
        <button className="btn btn-primary w-100">Kayıt Ol</button>
      </form>
      <p className="text-center mt-3">
        Zaten hesabın var mı? <Link to="/login">Giriş yap</Link>
      </p>
    </div>
  );
}