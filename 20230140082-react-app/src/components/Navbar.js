import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let user = null;
  try { if (token) user = jwtDecode(token); } catch (e) { localStorage.removeItem('token'); }

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      <div className="flex items-center space-x-4">
        <Link to="/" className="font-bold">Presensi App</Link>
        <Link to="/presensi">Presensi</Link>
        {user && user.role === 'admin' && <Link to="/reports">Laporan Admin</Link>}
      </div>
      <div>
        {user ? (
          <>
            <span className="mr-4">{user.nama}</span>
            <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;