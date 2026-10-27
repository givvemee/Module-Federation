import { NavLink, Outlet, Route, Routes } from 'react-router';
import { HomePage } from './pages/HomePage';
import { RemoteModule } from './remote/RemoteModule';

function Layout() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: '100vh', fontFamily: 'system-ui' }}>
      <nav style={{ padding: 16, borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <strong>mfe-admin-lab</strong>
        <NavLink to="/" end>홈</NavLink>
        <NavLink to="/content">콘텐츠</NavLink>
      </nav>
      <main style={{ padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="content/*" element={<RemoteModule id="remote_content/ContentPage" />} />
      </Route>
    </Routes>
  );
}
