import { NavLink } from 'react-router-dom';

const cls = ({ isActive }) => 'nav-link' + (isActive ? ' active' : '');

export default function AdminTabs() {
  return (
    <ul className="nav nav-tabs mb-3">
      <li className="nav-item">
        <NavLink end to="/admin" className={cls}>Tüm Başvurular</NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/admin/completed" className={cls}>Tamamlandı</NavLink>
      </li>
    </ul>
  );
}