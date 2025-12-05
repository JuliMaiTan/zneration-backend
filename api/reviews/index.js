import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT
        r.*,
        t.name AS technology_name,
        t.slug AS technology_slug,
        t.logo AS technology_logo,
        t.has_ai AS technology_has_ai,
        t.category_id
      FROM reviews r
      JOIN technologies t ON t.id = r.technology_id
      ORDER BY r.created_at DESC
    `);

    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
