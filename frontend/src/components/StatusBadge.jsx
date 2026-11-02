const STATUS = {
  YUKLENDI:   { label: 'Yüklendi',    cls: 'bg-secondary' },
  INCELENIYOR:{ label: 'İnceleniyor', cls: 'bg-info text-dark' },
  HATALI:     { label: 'Hatalı / Eksik', cls: 'bg-danger' },
  ONAYLANDI:  { label: 'Onaylandı',   cls: 'bg-primary' },
  TAMAMLANDI: { label: 'Tamamlandı',  cls: 'bg-success' },
};

export default function StatusBadge({ status }) {
  const s = STATUS[status] || { label: status, cls: 'bg-dark' };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}