const { Presensi, User } = require("../models");
const { Op } = require("sequelize");

exports.daily = async (req, res) => {
  try {
    const { nama, startDate, endDate } = req.query;
    const where = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) {
        const ed = new Date(endDate);
        ed.setHours(23, 59, 59, 999);
        where.createdAt[Op.lte] = ed;
      }
    }

    // Include User without alias so it matches the association defined in models
    const include = [{ model: User, attributes: ["id", "nama", "email", "role"] }];

    if (nama) {
      include[0].where = { nama: { [Op.substring]: nama } };
    }

    const presensis = await Presensi.findAll({
      where,
      include,
      order: [["createdAt", "DESC"]],
    });

    res.json(presensis);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil laporan", error: err.message });
  }
};
