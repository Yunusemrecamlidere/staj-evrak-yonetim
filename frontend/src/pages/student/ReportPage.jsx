import { useParams, Link } from 'react-router-dom';

export default function ReportPage() {
  const { id } = useParams();
  return (
    <div className="container my-4">
      <h3>Belge #{id} Raporu</h3>
      <div className="alert alert-info">
        Rapor, OCR entegrasyonu ile final aşamasında burada gösterilecek.
      </div>
      <Link to="/student" className="btn btn-outline-secondary">Geri dön</Link>
    </div>
  );
}