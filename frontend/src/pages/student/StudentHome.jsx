import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge';
// import api from '../../api/axios';

// GEÇİCİ MOCK veri
const MOCK_DOCS = [
  { id: 1, fileName: 'ek16_v1.pdf', uploadedAt: '2026-10-20', status: 'HATALI' },
  { id: 2, fileName: 'ek16_v2.pdf', uploadedAt: '2026-10-25', status: 'INCELENIYOR' },
  { id: 3, fileName: 'ek16_final.pdf', uploadedAt: '2026-10-28', status: 'TAMAMLANDI' },
];

export default function StudentHome() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        // Backend hazır olunca:
        // const { data } = await api.get('/documents/my');
        // setDocs(data);
        await new Promise((r) => setTimeout(r, 400));
        setDocs(MOCK_DOCS);
      } catch (err) {
        setError('Belgeler yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Belgelerim</h3>
        <Link to="/student/upload" className="btn btn-primary">
          + Evrak Yükle
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" />
        </div>
      ) : docs.length === 0 ? (
        <div className="alert alert-secondary">Henüz belge yüklemediniz.</div>
      ) : (
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Dosya</th>
              <th>Yüklenme Tarihi</th>
              <th>Durum</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.fileName}</td>
                <td>{d.uploadedAt}</td>
                <td><StatusBadge status={d.status} /></td>
                <td className="text-end">
                  <Link
                    to={`/student/report/${d.id}`}
                    className="btn btn-outline-secondary btn-sm me-2"
                  >
                    Rapor
                  </Link>
                  {d.status === 'HATALI' && (
                    <Link to="/student/upload" className="btn btn-outline-danger btn-sm">
                      Yeniden Yükle
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}