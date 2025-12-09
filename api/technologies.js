export const config = {
  runtime: "nodejs",
};

import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 🔥 CORS — necessário para permitir consumo pelo domínio customizado
function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "https://www.znerationtech.com");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  // aplica CORS em todas as respostas
  setCors(res);

  // resposta imediata para preflight OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

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
