const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

exports.register = async (req, res) => {
  try {
    const { nama, email, password, role } = req.body;
    const cleanRole = ['mahasiswa', 'admin'].includes(role) ? role : 'mahasiswa';

    if (!nama || !email || !password) {
      return res.status(400).json({ message: 'Registrasi gagal', error: 'nama, email, dan password wajib diisi' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      nama,
      email,
      password: hashed,
      role: cleanRole
    });

    const token = jwt.sign({ id: user.id, nama: user.nama, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    return res.status(201).json({ message: 'Registrasi berhasil', token });
  } catch (err) {
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      const messages = err.errors ? err.errors.map(e => e.message).join(', ') : err.message;
      return res.status(400).json({ message: 'Registrasi gagal', error: messages });
    }
    return res.status(500).json({ message: 'Registrasi gagal', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email dan password diperlukan' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Email atau password salah' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Email atau password salah' });

    const token = jwt.sign({ id: user.id, nama: user.nama, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ message: 'Login berhasil', token });
  } catch (err) {
    return res.status(500).json({ message: 'Login gagal', error: err.message });
  }
};