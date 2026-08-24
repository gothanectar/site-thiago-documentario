const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, email, role } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      const result = await pool.query(
        'INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING id, name, email, role, created_at',
        [name, email, role || 'Membro Autodidata']
      );
      
      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Failed to create user' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
