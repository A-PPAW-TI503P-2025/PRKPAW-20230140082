const { Presensi } = require('../models');
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query;
    let where = {};

    if (nama) {
      where.nama = { [Op.like]: `%${nama}%` };
    }

    if (tanggalMulai && tanggalSelesai) {
      const start = new Date(tanggalMulai);
      const end = new Date(tanggalSelesai);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ message: 'tanggalMulai atau tanggalSelesai tidak valid' });
      }
      end.setHours(23, 59, 59, 999);
      where.checkIn = { [Op.between]: [start, end] };
    } else if (tanggalMulai) {
      const start = new Date(tanggalMulai);
      if (isNaN(start.getTime())) return res.status(400).json({ message: 'tanggalMulai tidak valid' });
      where.checkIn = { [Op.gte]: start };
    } else if (tanggalSelesai) {
      const end = new Date(tanggalSelesai);
      if (isNaN(end.getTime())) return res.status(400).json({ message: 'tanggalSelesai tidak valid' });
      end.setHours(23, 59, 59, 999);
      where.checkIn = { [Op.lte]: end };
    }

    const records = await Presensi.findAll({ where, order: [['checkIn', 'ASC']] });

    res.json({
      reportDate: new Date().toLocaleDateString(),
      data: records,
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil laporan", error: error.message });
  }
};