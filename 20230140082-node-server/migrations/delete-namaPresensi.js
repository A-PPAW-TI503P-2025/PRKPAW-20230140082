'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    // pastikan nama tabel sesuai (kebanyakan DB kamu pakai lowercase 'presensis' & 'users')
    const tableName = 'presensis';
    const userTable = 'users';

    // ambil deskripsi tabel untuk cek keberadaan kolom
    const desc = await queryInterface.describeTable(tableName).catch(() => ({}));
    if (desc && desc.nama) {
      await queryInterface.removeColumn(tableName, 'nama');
    }

    // tambahkan foreign key (pastikan tidak ada orphan rows sebelum menjalankan migration)
    await queryInterface.addConstraint(tableName, {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_presensis_userId',
      references: { table: userTable, field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    const tableName = 'presensis';
    // hapus constraint jika ada
    await queryInterface.removeConstraint(tableName, 'fk_presensis_userId').catch(() => {});

    // kembalikan kolom nama (sesuaikan defaultValue jika perlu)
    await queryInterface.addColumn(tableName, 'nama', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    });
  }
};