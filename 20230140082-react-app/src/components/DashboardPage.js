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

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

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
    return (
      <div className="flex items-center justify-center bg-gray-100" style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-3">Login Sukses!</h2>
          <p className="text-gray-700 mb-4">Selamat datang di halaman dashboard Anda.</p>
          <p className="text-sm text-gray-500 mb-6">{user?.nama} — ({user?.role})</p>
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => navigate('/attendance')}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Buka Presensi
            </button>

            <button
              type="button"
              onClick={logout}
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
}

export default DashboardPage;