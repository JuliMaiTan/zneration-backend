// Força o Node.js runtime (obrigatório)
export const config = {
  runtime: "nodejs",
};

import { Pool } from "pg";

// Conexão Neon Postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Endpoint GET /api/technologies
export default async function handler(req, res) {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        slug,
        logo,
        short_description AS "shortDescription"
      FROM technologies
      ORDER BY id;
    `);

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ technologies: result.rows });
  } catch (err) {
    console.error("API ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}
