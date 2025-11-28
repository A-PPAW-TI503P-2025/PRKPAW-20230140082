import React, { useState } from 'react';
import axios from 'axios';

function PresensiPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const formatDateTime = (iso) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    } catch (e) {
      return iso;
    }
  };

  const handleCheckIn = async () => {
    setError('');
    setMessage('');
    try {
      const res = await axios.post('http://localhost:3001/api/presensi/check-in', {}, getAuthConfig());
      const checkInTime = res.data?.data?.checkIn;
      setMessage(checkInTime
        ? `Check-in berhasil pada ${formatDateTime(checkInTime)}`
        : (res.data?.message || 'Check-in berhasil'));
    } catch (err) {
      setError(err.response?.data?.message || 'Check-in gagal');
    }
  };

  const handleCheckOut = async () => {
    setError('');
    setMessage('');
    try {
      const res = await axios.post('http://localhost:3001/api/presensi/check-out', {}, getAuthConfig());
      const checkOutTime = res.data?.data?.checkOut;
      setMessage(checkOutTime
        ? `Check-out berhasil pada ${formatDateTime(checkOutTime)}`
        : (res.data?.message || 'Check-out berhasil'));
    } catch (err) {
      setError(err.response?.data?.message || 'Check-out gagal');
    }
  };

  return (
    <div
      className="bg-gray-100 flex items-center justify-center"
      style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Lakukan Presensi</h2>

        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="flex space-x-4">
          <button
            onClick={handleCheckIn}
            className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700"
          >
            Check-In
          </button>

          <button
            onClick={handleCheckOut}
            className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700"
          >
            Check-Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default PresensiPage;