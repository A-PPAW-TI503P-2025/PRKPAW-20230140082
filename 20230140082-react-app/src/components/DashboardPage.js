import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function DashboardPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  let user = null;
  try {
    if (token) user = jwtDecode(token);
  } catch (e) {
    localStorage.removeItem('token');
    user = null;
  }

  const openPresensi = () => navigate('/presensi');

  if (!user) {
    return (
      <div className="flex items-center justify-center bg-gray-100" style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        <div className="text-center">
          <p className="text-red-600">Silakan login terlebih dahulu.</p>
        </div>
      </div>
    );
  }

  // Centered layout for mahasiswa role (less top gap, content horizontally centered)
  if (user.role === 'mahasiswa') {
    return (
      <div className="flex flex-col items-center bg-gray-100 pt-20 px-4" style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        <div className="w-full max-w-3xl">
          <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>

          <div className="bg-white shadow rounded-lg p-6 mx-auto w-full max-w-2xl">
            <h2 className="text-lg font-semibold mb-2 text-center">Aksi Cepat</h2>
            <p className="text-sm text-gray-600 mb-6 text-center">Gunakan tombol di bawah untuk membuka halaman presensi.</p>
            <div className="flex justify-center">
              <button
                onClick={openPresensi}
                className="inline-block bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700"
              >
                Buka Presensi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default view for other roles (e.g., admin)
  return (
    <div className="flex flex-col items-center bg-gray-100 pt-20 px-4" style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p>Selamat datang, {user.nama} (role: {user.role}).</p>
      </div>
    </div>
  );
}

export default DashboardPage;