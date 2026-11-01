import { useEffect, useState } from 'react';
import StatusBadge from '../../components/StatusBadge';
import { MOCK_ALL_DOCS } from '../../mock/documents';
// import api from '../../api/axios';

export default function AdminApplications() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        // Backend hazır olunca:
        // const { data } = await api.get('/admin/documents');
        // setDocs(data);
        await new Promise((r) => setTimeout(r, 400));
        setDocs(MOCK_ALL_DOCS);
      } catch {
        setError('Başvurular yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="container my-4">
      <h3 className="mb-3">Tüm Başvurular</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border" /></div>
      ) : docs.length === 0 ? (
        <div className="alert alert-secondary">Başvuru yok.</div>
      ) : (
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Öğrenci</th>
              <th>Dosya</th>
              <th>Yüklenme Tarihi</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.studentName}</td>
                <td>{d.fileName}</td>
                <td>{d.uploadedAt}</td>
                <td><StatusBadge status={d.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}