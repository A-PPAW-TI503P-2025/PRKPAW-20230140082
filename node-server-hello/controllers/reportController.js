const { Presensi } = require('../models');
const { format } = require('date-fns-tz');
const timeZone = 'Asia/Jakarta';

exports.getDailyReport = async (req, res) => {
  try {
    const records = await Presensi.findAll({ order: [['checkIn', 'ASC']] });

    const data = records.map(r => ({
      id: r.id,
      userId: r.userId,
      nama: r.nama,
      checkIn: r.checkIn ? format(r.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }) : null,
      checkOut: r.checkOut ? format(r.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }) : null,
      createdAt: r.createdAt ? format(r.createdAt, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }) : null,
      updatedAt: r.updatedAt ? format(r.updatedAt, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }) : null
    }));

    res.json({
      reportDate: format(new Date(), "yyyy-MM-dd", { timeZone }),
      data
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil laporan', error: error.message });
  }
};