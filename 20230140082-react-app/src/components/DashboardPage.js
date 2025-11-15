import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ nama: 'Pengguna', role: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const payload = jwtDecode(token);
      setUser({
        nama: payload.nama || payload.name || payload.username || 'Pengguna',
        role: payload.role || '',
      });
    } catch {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

    const handleLogout = () => {
        const ok = window.confirm('Yakin ingin logout?');
        if (!ok) return;
        localStorage.removeItem('token');
        navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Full-width header */}
      <header className="w-full bg-white shadow-sm border-b fixed top-0 left-0 z-20">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div>
              <h1 className="text-xl font-bold text-green-700">Dashboard Presensi</h1>
              <p className="text-xs text-gray-500">Kelola presensi dan laporan</p>
            </div>

            <nav className="hidden md:flex items-center gap-4 ml-6">
              <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-600 hover:text-green-700">Home</button>
              <button onClick={() => navigate('/presensi')} className="text-sm text-gray-600 hover:text-green-700">Presensi</button>
              <button onClick={() => navigate('/reports')} className="text-sm text-gray-600 hover:text-green-700">Laporan</button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700 hidden sm:block">
              Halo, <span className="font-semibold">{user.nama}</span>
            </div>
            <button
              onClick={handleLogout}
              className="py-2 px-4 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content area (pad top to avoid header overlap) */}
      <main className="pt-28 pb-12">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Perubahan: card Presensi sekarang warna putih seperti Laporan Mingguan,
                namun tetap menampilkan garis kecil hijau */}
            <section className="p-6 rounded-lg bg-white border">
              <h2 className="text-lg font-medium text-gray-700">Presensi Hari Ini</h2>
              <div className="mt-4">
                {/* garis kecil hijau */}
                <div className="h-2 w-12 bg-green-600 rounded-sm"></div>
                <p className="mt-4 text-sm text-gray-600">Tidak ada data terbaru</p>
              </div>
            </section>

            <section className="p-6 rounded-lg bg-white border">
              <h2 className="text-lg font-medium text-gray-700">Laporan Mingguan</h2>
              <div className="mt-4">
                <div className="h-2 w-12 bg-blue-600 rounded-sm"></div>
                <p className="mt-4 text-sm text-gray-600">Gunakan menu laporan untuk melihat detail</p>
              </div>
            </section>

            <section className="p-6 rounded-lg bg-white border">
              <h2 className="text-lg font-medium text-gray-700">Aksi Cepat</h2>
              <div className="mt-4 flex flex-col gap-3">
                <button onClick={() => navigate('/presensi')} className="py-3 bg-green-600 text-white rounded-md">Buka Presensi</button>
                <button onClick={() => navigate('/reports/daily')} className="py-3 bg-blue-600 text-white rounded-md">Lihat Laporan</button>
              </div>
            </section>
          </div>

          <div className="mt-8 p-4 rounded-lg border-dashed border bg-white text-sm text-gray-600">
            Tip: Klik menu di header untuk navigasi cepat.
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;