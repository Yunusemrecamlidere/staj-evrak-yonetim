import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import api from '../../api/axios';

const ALLOWED = ['doc', 'docx', 'pdf', 'jpg', 'jpeg', 'png'];
const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];

const emptyForm = {
  fullName: '',
  tcNo: '',
  nationality: 'TC',
  studentNo: '',
  birthDate: '',
  department: '',
  address: '',
  phone: '',
  email: '',
  fax: '',
  semester: '',
  startDate: '',
  endDate: '',
  engineerCount: '',
  engineerDepartment: '',
};

export default function UploadDocument() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [days, setDays] = useState([]);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const formatPhone = (value) => {
    let digits = value.replace(/\D/g, '');
    if (digits.startsWith('90')) digits = digits.slice(2);
    else if (digits.startsWith('0')) digits = digits.slice(1);
    digits = digits.slice(0, 10);

    const parts = [
      digits.slice(0, 3),
      digits.slice(3, 6),
      digits.slice(6, 8),
      digits.slice(8, 10),
    ].filter(Boolean);

    return parts.length ? '+90 ' + parts.join(' ') : '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'phone' ? formatPhone(value) : value });
  };

  const toggleDay = (day) =>
    setDays(days.includes(day) ? days.filter((d) => d !== day) : [...days, day]);

  const handleFile = (e) => {
    const f = e.target.files[0];
    setFileError('');
    setFile(null);
    if (!f) return;

    const ext = f.name.split('.').pop().toLowerCase();
    if (!ALLOWED.includes(ext)) {
      setFileError('Geçersiz format! Sadece Word (.doc/.docx), PDF, JPEG ve PNG yüklenebilir.');
      e.target.value = '';
      return;
    }
    setFile(f);
  };

  const validate = () => {
    const err = {};

    if (form.nationality === 'TC') {
      if (!/^[1-9]\d{10}$/.test(form.tcNo))
        err.tcNo = 'T.C. kimlik no 11 haneli olmalı ve 0 ile başlamamalı.';
    } else {
      if (!/^99\d{9}$/.test(form.tcNo))
        err.tcNo = 'Yabancı kimlik no 11 haneli olmalı ve 99 ile başlamalı.';
    }

    if (!/^\+90 \d{3} \d{3} \d{2} \d{2}$/.test(form.phone))
      err.phone = 'Telefon +90 xxx xxx xx xx formatında olmalı.';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = 'Geçerli bir e-posta girin.';

    if (!/^\d{4}-\d{4} (Güz|Bahar|Yaz)$/.test(form.semester))
      err.semester = 'Örnek: 2025-2026 Bahar';

    if (form.startDate && form.endDate && form.endDate < form.startDate)
      err.endDate = 'Bitiş tarihi başlangıçtan önce olamaz.';

    if (days.length === 0) err.days = 'En az bir staj günü seçin.';

    const eng = Number(form.engineerCount);
    if (!form.engineerCount || eng < 1)
      err.engineerCount = 'Mühendis sayısı en az 1 olmalı.';
    else if (eng < 5 && !form.engineerDepartment.trim())
      err.engineerDepartment = "Mühendis sayısı 5'ten az: mezun olduğu bölümü yazın.";

    if (!file) err.file = 'Lütfen bir belge seçin.';

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    setLoading(true);
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('info', JSON.stringify({ ...form, internshipDays: days }));

      // GEÇİCİ MOCK: backend hazır olunca şunu aç, mock satırlarını sil:
      // const { data: res } = await api.post('/documents/upload', data);
      console.log('Gönderilecek:', file.name, form, days);
      await new Promise((r) => setTimeout(r, 800));
      const res = { id: 2 };

      navigate(`/student/report/${res.id}`);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Yükleme başarısız.' });
    } finally {
      setLoading(false);
    }
  };

  const field = (name, label, props = {}) => (
    <div className="col-md-6 mb-3">
      <label className="form-label">{label}</label>
      <input
        name={name}
        className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
        value={form[name]}
        onChange={handleChange}
        {...props}
      />
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  const eng = Number(form.engineerCount);

  return (
    <div className="container my-4" style={{ maxWidth: 800 }}>
      <h3 className="mb-4">Evrak Yükle</h3>

      {errors.general && <div className="alert alert-danger">{errors.general}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card mb-4">
          <div className="card-header">1. Ek-16 Belgesi</div>
          <div className="card-body">
            <input
              type="file"
              className={`form-control ${fileError || errors.file ? 'is-invalid' : ''}`}
              accept=".doc,.docx,.pdf,.jpg,.jpeg,.png"
              onChange={handleFile}
            />
            {(fileError || errors.file) && (
              <div className="invalid-feedback">{fileError || errors.file}</div>
            )}
            <div className="form-text">Kabul edilen: Word, PDF, JPEG, PNG</div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">2. Öğrenci Bilgileri</div>
          <div className="card-body">
            <div className="row">
              {field('fullName', 'Ad Soyad', { required: true })}
              <div className="col-md-6 mb-3">
                <label className="form-label">Uyruk</label>
                <select
                  name="nationality"
                  className="form-select"
                  value={form.nationality}
                  onChange={handleChange}
                >
                  <option value="TC">T.C.</option>
                  <option value="YABANCI">Yabancı</option>
                </select>
              </div>
              {field('tcNo', 'Kimlik No', { maxLength: 11, required: true })}
              {field('studentNo', 'Öğrenci No', { required: true })}
              {field('birthDate', 'Doğum Tarihi', { type: 'date', required: true })}
              {field('department', 'Bölüm', { required: true })}
              {field('phone', 'Telefon', { placeholder: '+90 5xx xxx xx xx', required: true })}
              {field('email', 'E-posta', { type: 'email', required: true })}
              {field('fax', 'Faks (opsiyonel)')}
            </div>
            <div className="mb-3">
              <label className="form-label">Adres</label>
              <textarea
                name="address"
                className="form-control"
                rows={2}
                placeholder="Mahalle, Cadde/Sokak, Bina No, Daire No, İlçe/İl"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">3. Staj Bilgileri</div>
          <div className="card-body">
            <div className="row">
              {field('semester', 'Öğretim Yılı / Yarıyıl', {
                placeholder: '2025-2026 Bahar',
                required: true,
              })}
              <div className="col-md-6" />
              {field('startDate', 'Staj Başlangıç', { type: 'date', required: true })}
              {field('endDate', 'Staj Bitiş', { type: 'date', required: true })}
            </div>

            <label className="form-label">Haftalık staj günleri</label>
            <div className="mb-3">
              {DAYS.map((d) => (
                <div className="form-check form-check-inline" key={d}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={d}
                    checked={days.includes(d)}
                    onChange={() => toggleDay(d)}
                  />
                  <label className="form-check-label" htmlFor={d}>{d}</label>
                </div>
              ))}
              {errors.days && <div className="text-danger small">{errors.days}</div>}
            </div>

            <div className="row">
              {field('engineerCount', 'Firmadaki Mühendis Sayısı', {
                type: 'number',
                min: 0,
                required: true,
              })}
              {eng >= 1 && eng < 5 &&
                field('engineerDepartment', 'Mühendis(ler)in mezun olduğu bölüm')}
            </div>
          </div>
        </div>

        <button className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Yükleniyor...
            </>
          ) : (
            'Evrak Yükle'
          )}
        </button>
      </form>
    </div>
  );
}