import { useState } from 'react';
import Papa from 'papaparse';
// import api from '../../api/axios';

const COLUMNS = [
  'adSoyad', 'tcNo', 'uyruk', 'ogrenciNo', 'dogumTarihi',
  'adres', 'bolum', 'teslimYili', 'oncekiStajGunu',
  'email', 'telefon', 'saglikYardimi',
];

const LABELS = {
  adSoyad: 'Ad Soyad',
  tcNo: 'TC Kimlik No',
  uyruk: 'Uyruk',
  ogrenciNo: 'Öğrenci No',
  dogumTarihi: 'Doğum Tarihi',
  adres: 'Adres',
  bolum: 'Bölüm',
  teslimYili: 'Teslim Yılı',
  oncekiStajGunu: 'Önceki Staj Günü',
  email: 'E-posta',
  telefon: 'Telefon',
  saglikYardimi: 'Sağlık Yardımı',
};

export default function DatasetUpload() {
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    setError('');
    setSuccess('');
    setRows([]);
    if (!f) return;

    if (!f.name.toLowerCase().endsWith('.csv')) {
      setError('Sadece .csv dosyası yüklenebilir.');
      e.target.value = '';
      return;
    }

    setFileName(f.name);
    Papa.parse(f, {
  header: true,
  skipEmptyLines: true,
  delimitersToGuess: [',', ';', '\t'],
  transformHeader: (h) => h.replace(/^\uFEFF/, '').trim(),
  complete: (result) => {
    const headers = result.meta.fields || [];
    const missing = COLUMNS.filter((c) => !headers.includes(c));
    if (missing.length > 0) {
      setError(
        'Eksik sütunlar: ' + missing.join(', ') +
        ' | Okunan sütunlar: ' + (headers.join(' / ') || 'hiçbiri')
      );
      return;
    }
    setRows(result.data);
  },
  error: () => setError('Dosya okunamadı.'),
});
  };

  const handleImport = async () => {
    setLoading(true);
    setError('');
    try {
      // Backend hazır olunca:
      // await api.post('/admin/dataset/import', rows);
      await new Promise((r) => setTimeout(r, 800));
      setSuccess(`${rows.length} öğrenci kaydı içe aktarıldı.`);
      setRows([]);
      setFileName('');
    } catch (err) {
      setError(err.response?.data?.message || 'İçe aktarma başarısız.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h3 className="mb-3">Test Veri Seti Yükle</h3>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <input
            type="file"
            accept=".csv"
            className="form-control"
            onChange={handleFile}
          />
          <div className="form-text">
            Beklenen sütunlar: {COLUMNS.join(', ')}
          </div>
        </div>
      </div>

      {rows.length > 0 && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span>
              <strong>{fileName}</strong> - {rows.length} kayıt (önizleme)
            </span>
            <button
              className="btn btn-primary"
              onClick={handleImport}
              disabled={loading}
            >
              {loading ? 'Aktarılıyor...' : 'İçe Aktar'}
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-sm table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  {COLUMNS.map((c) => (
                    <th key={c}>{LABELS[c]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    {COLUMNS.map((c) => (
                      <td key={c}>{r[c]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}