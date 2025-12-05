import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  const { slug } = req.query;

  try {
    const { rows } = await pool.query(
      `
      SELECT
        r.*,
        t.name AS technology_name,
        t.slug AS technology_slug,
        t.logo AS technology_logo,
        t.has_ai AS technology_has_ai
      FROM reviews r
      JOIN technologies t ON t.id = r.technology_id
      WHERE r.slug = $1
      LIMIT 1
      `,
      [slug]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Review not found" });

    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
