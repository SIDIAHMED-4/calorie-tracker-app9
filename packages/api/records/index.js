import db from "../db.js";

export default function handler(req, res) {
  if (req.method === "GET") {
    const { date } = req.query;
    const sql = date
      ? "SELECT * FROM calorie_records WHERE r_date = ?"
      : "SELECT * FROM calorie_records";

    const params = date ? [date] : [];
    db.all(sql, params, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ result: rows });
    });
  } else if (req.method === "POST") {
    const { r_date, r_meal, r_food, r_cal } = req.body;
    if (!r_date || !r_meal || !r_food || !r_cal) {
      return res.status(400).json({ error: "All fields required" });
    }

    const sql =
      "INSERT INTO calorie_records (r_date, r_meal, r_food, r_cal) VALUES (?, ?, ?, ?)";
    db.run(sql, [r_date, r_meal, r_food, r_cal], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ message: "Record inserted", id: this.lastID });
    });
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
