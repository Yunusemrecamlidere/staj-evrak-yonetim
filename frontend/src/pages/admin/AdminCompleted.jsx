import { useEffect, useState } from 'react';
import StatusBadge from '../../components/StatusBadge';
import { MOCK_ALL_DOCS } from '../../mock/documents';
// import api from '../../api/axios';

const STATUSES = ['YUKLENDI', 'INCELENIYOR', 'HATALI', 'ONAYLANDI', 'TAMAMLANDI'];

export default function AdminCompleted() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // düzenlenen belge
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const load = async () => {
      // Backend hazır olunca:
      // const { data } = await api.get('/admin/documents?status=TAMAMLANDI');
      await new Promise((r) => setTimeout(r, 400));
      setDocs(MOCK_ALL_DOCS.filter((d) => d.status === 'TAMAMLANDI'));
      setLoading(false);
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Bu belgeyi silmek istediğinize emin misiniz?')) return;
    // await api.delete(`/admin/documents/${id}`);
    setDocs(docs.filter((d) => d.id !== id));
  };

  const openEdit = (doc) => {
    setEditing(doc);
    setNewStatus(doc.status);
  };

  const handleSave = async () => {
    // await api.put(`/admin/documents/${editing.id}`, { status: newStatus });
    if (newStatus === 'TAMAMLANDI') {
      setDocs(docs.map((d) => (d.id === editing.id ? { ...d, status: newStatus } : d)));
    } else {
      // Statü değişti, artık Tamamlandı listesinde değil
      setDocs(docs.filter((d) => d.id !== editing.id));
    }
    setEditing(null);
  };

  return (
    <div className="container my-4">
      <h3 className="mb-3">Tamamlanan Başvurular</h3>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border" /></div>
      ) : docs.length === 0 ? (
        <div className="alert alert-secondary">Tamamlanan başvuru yok.</div>
      ) : (
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Öğrenci</th>
              <th>Dosya</th>
              <th>Tarih</th>
              <th>Durum</th>
              <th></th>
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
                <td className="text-end">
                  <button
                    className="btn btn-outline-secondary btn-sm me-2"
                    onClick={() => openEdit(d)}
                  >
                    Düzenle
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(d.id)}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editing && (
        <>
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Belgeyi Düzenle: {editing.fileName}</h5>
                  <button className="btn-close" onClick={() => setEditing(null)} />
                </div>
                <div className="modal-body">
                  <label className="form-label">Durum</label>
                  <select
                    className="form-select"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setEditing(null)}>
                    İptal
                  </button>
                  <button className="btn btn-primary" onClick={handleSave}>
                    Kaydet
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" />
        </>
      )}
    </div>
  );
}