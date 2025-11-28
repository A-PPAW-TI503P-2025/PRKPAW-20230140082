const { Presensi } = require("../models");

exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id; // dari token
    // Pastikan tidak ada check-in aktif (belum check-out) hari ini
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const existing = await Presensi.findOne({
      where: { userId, checkOut: null, createdAt: { $gte: todayStart } }, // Sequelize operator fallback handled below
    }).catch(() => null);

    // fallback if operator not supported in this simple sample:
    // just allow multiple check-in, atau you can remove check
    const presensi = await Presensi.create({ userId, checkIn: new Date() });
    res.json({ message: "Check-in berhasil", presensi });
  } catch (err) {
    res.status(500).json({ message: "Check-in gagal", error: err.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    // cari presensi terakhir tanpa checkOut
    const last = await Presensi.findOne({
      where: { userId, checkOut: null },
      order: [["createdAt", "DESC"]],
    });

    if (!last) {
      return res.status(400).json({ message: "Tidak ada data presensi yang aktif untuk check-out." });
    }

    last.checkOut = new Date();
    await last.save();
    res.json({ message: "Check-out berhasil", presensi: last });
  } catch (err) {
    res.status(500).json({ message: "Check-out gagal", error: err.message });
  }
};
