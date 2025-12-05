export default async function handler(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT
        t.id,
        t.name,
        t.slug,
        t.logo,
        t.short_description AS "shortDescription",
        t.images,
        c.name AS category
      FROM technologies t
      LEFT JOIN categories c ON c.id = t.category_id
      ORDER BY t.id;
    `);

    res.status(200).json(rows);

  } catch (err) {
    console.error("API ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
}
