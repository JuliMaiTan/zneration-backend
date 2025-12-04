export const config = {
  runtime: "nodejs",
};

import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: "Missing slug parameter" });
  }

  try {
    const { rows } = await pool.query(
      `
      SELECT
        t.id,
        t.name,
        t.slug,
        t.logo,
        t.short_description AS "shortDescription",
        t.long_description AS "longDescription",
        t.images,
        t.has_ai AS "hasAI",
        t.official_website AS "officialWebsite",
        t.affiliate_url AS "affiliateUrl",
        c.name AS category
      FROM technologies t
      LEFT JOIN categories c ON c.id = t.category_id
      WHERE t.slug = $1
      LIMIT 1;
      `,
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Technology not found" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("API ERROR (slug):", err);
    res.status(500).json({ error: err.message });
  }
}
