import db from "../db.js";

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    const sql = "SELECT * FROM calorie_records WHERE id = ?";
    db.get(sql, [id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "Record not found" });
      res.status(200).json(row);
    });
  } else if (req.method === "PUT") {
    const { r_date, r_meal, r_food, r_cal } = req.body;
    if (!r_date || !r_meal || !r_food || !r_cal) {
      return res.status(400).json({ error: "All fields required" });
    }

    const checkSql = "SELECT * FROM calorie_records WHERE id = ?";
    db.get(checkSql, [id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "Record not found" });

      const sql =
        "UPDATE calorie_records SET r_date=?, r_meal=?, r_food=?, r_cal=? WHERE id=?";
      db.run(sql, [r_date, r_meal, r_food, r_cal, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Record updated", id });
      });
    });
  } else if (req.method === "DELETE") {
    const checkSql = "SELECT * FROM calorie_records WHERE id = ?";
    db.get(checkSql, [id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "Record not found" });

      const sql = "DELETE FROM calorie_records WHERE id = ?";
      db.run(sql, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Record deleted", id });
      });
    });
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
