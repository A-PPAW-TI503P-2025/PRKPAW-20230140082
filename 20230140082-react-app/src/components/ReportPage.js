import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchReports = async (query = "") => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (query) params.nama = query;
      if (startDate) params.tanggalMulai = startDate;
      if (endDate) params.tanggalSelesai = endDate;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      };

      const res = await axios.get("http://localhost:3001/api/reports/daily", config);

      // backend mungkin mengembalikan { data: [...] } atau langsung [...]
      const data = res.data && res.data.data ? res.data.data : res.data;
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil laporan");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports("");
    // eslint-disable-next-line
  }, [navigate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports(searchTerm);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Laporan Presensi Harian</h1>

      <form onSubmit={handleSearchSubmit} className="mb-6 flex space-x-2 items-center">
        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-3 py-2 border rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-3 py-2 border rounded"
        />
        <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded-md">
          Cari
        </button>
        <button
          type="button"
          onClick={() => {
            setSearchTerm("");
            setStartDate("");
            setEndDate("");
            fetchReports("");
          }}
          className="py-2 px-4 bg-gray-300 text-gray-800 rounded-md"
        >
          Reset
        </button>
      </form>

      {error && (
        <p className="text-red-600 bg-red-100 p-4 rounded-md mb-4">{error}</p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.length > 0 ? (
                reports.map((presensi) => (
                  <tr key={presensi.id || `${presensi.userId}-${presensi.checkIn}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {/* fallback: presensi.User.nama | presensi.user.nama | presensi.nama */}
                      {presensi.User?.nama || presensi.user?.nama || presensi.nama || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {presensi.checkIn
                        ? new Date(presensi.checkIn).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {presensi.checkOut
                        ? new Date(presensi.checkOut).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
                        : "Belum Check-Out"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                    Tidak ada data yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ReportPage;