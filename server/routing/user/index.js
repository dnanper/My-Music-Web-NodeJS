const db = require("../../db");

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      const [users] = await db.query("SELECT id, username, email FROM users");
      return res.json(users);
    }

    const [user] = await db.query(
      "SELECT id, username, email FROM users WHERE id = ?",
      [id]
    );
    if (user.length === 0) {
      return res.status(404).json({ error: "User không tồn tại" });
    }

    res.json(user[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server" });
  }
};
