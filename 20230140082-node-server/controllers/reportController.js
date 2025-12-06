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

    // Include User with alias matching the model association
    const include = [{ model: User, as: 'user', attributes: ["id", "nama", "email", "role"], required: false }];

    if (nama) {
      include[0].where = { nama: { [Op.substring]: nama } };
    }

    const presensis = await Presensi.findAll({
      where,
      include,
      order: [["createdAt", "DESC"]],
    });

    // Normalize included User into `user` property for frontend compatibility
    const normalized = presensis.map((p) => {
      const plain = p.toJSON();
      return {
        id: plain.id,
        checkIn: plain.checkIn,
        checkOut: plain.checkOut,
        latitude: plain.latitude,
        longitude: plain.longitude,
        buktiFoto: plain.buktiFoto,
        createdAt: plain.createdAt,
        updatedAt: plain.updatedAt,
        user: plain.User || plain.user || null,
      };
    });

    res.json({ data: normalized });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil laporan", error: err.message });
  }
};
