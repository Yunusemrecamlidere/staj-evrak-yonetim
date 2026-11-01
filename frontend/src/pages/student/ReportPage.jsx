import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge';
import ReportTable from '../../components/ReportTable';
import { useAuth } from '../../context/AuthContext';
import { MOCK_REPORT } from '../../mock/report';
// import api from '../../api/axios';

export default function ReportPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const backTo = isAdmin ? '/admin' : '/student';

  useEffect(() => {
    const load = async () => {
      try {
        // Backend hazır olunca:
        // const { data } = await api.get(`/documents/${id}/report`);
        // setReport(data);
        await new Promise((r) => setTimeout(r, 400));
        setReport({ ...MOCK_REPORT, id });
      } catch {
        setError('Rapor yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border" /></div>;
  }
  if (error) {
    return <div className="container my-4"><div className="alert alert-danger">{error}</div></div>;
  }

  const problems = report.rows.filter((r) => !r.ok).length;

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">
          Belge #{id} Raporu <small className="text-muted fs-6">{report.fileName}</small>
        </h3>
        <StatusBadge status={report.status} />
      </div>

      {report.ready ? (
        <div className="alert alert-success">Belge teslime hazır, uyuşmazlık bulunmadı.</div>
      ) : (
        <div className="alert alert-warning">
          {problems} alanda sorun var. {isAdmin ? '' : 'Düzeltip belgeyi yeniden yükleyin.'}
        </div>
      )}

      {!isAdmin && report.status === 'TAMAMLANDI' && (
        <div className="alert alert-secondary">Bu belge tamamlandı, öğrenci tarafından değiştirilemez.</div>
      )}

      <ReportTable rows={report.rows} />

      <Link to={backTo} className="btn btn-outline-secondary me-2">Geri dön</Link>
      {!isAdmin && report.status === 'HATALI' && (
        <Link to="/student/upload" className="btn btn-danger">Yeniden Yükle</Link>
      )}
    </div>
  );
}