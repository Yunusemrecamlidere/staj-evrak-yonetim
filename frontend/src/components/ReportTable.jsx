export default function ReportTable({ rows }) {
  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Alan</th>
            <th>Formda girilen</th>
            <th>Belgeden okunan</th>
            <th>Veri setindeki</th>
            <th>Sonuç</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.field} className={r.ok ? '' : 'table-danger'}>
              <td>{r.field}</td>
              <td>{r.form || '—'}</td>
              <td>{r.document || '—'}</td>
              <td>{r.dataset || '—'}</td>
              <td>
                {r.ok ? (
                  <span className="badge bg-success">✔ Uyuşuyor</span>
                ) : (
                  <span className="badge bg-danger">✖ {r.message || 'Uyuşmuyor'}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}