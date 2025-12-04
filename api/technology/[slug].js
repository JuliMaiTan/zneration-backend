import { Pool } from "pg";

export const config = {
  runtime: "nodejs",
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  const { slug } = req.query;

  try {
    const { rows } = await pool.query(
      `
      SELECT
        t.*,
        c.name AS category
      FROM technologies t
      LEFT JOIN categories c ON c.id = t.category_id
      WHERE t.slug = $1
      LIMIT 1
      `,
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Technology not found" });
    }

    res.status(200).json(rows[0]);

  } catch (err) {
    console.error("API ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}
