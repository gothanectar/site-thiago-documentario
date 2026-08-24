const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const { type } = req.query;
    
    try {
      let query = 'SELECT * FROM posts';
      let params = [];
      
      if (type) {
        query += ' WHERE type = $1 ORDER BY created_at DESC';
        params.push(type);
      } else {
        query += ' ORDER BY created_at DESC';
      }
      
      const result = await pool.query(query, params);
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching posts:', error);
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { type, html, user_name } = req.body;
      
      if (!type || !html) {
        return res.status(400).json({ error: 'Type and html are required' });
      }

      const result = await pool.query(
        'INSERT INTO posts (type, html, user_name) VALUES ($1, $2, $3) RETURNING *',
        [type, html, user_name || 'Usuário Criativo']
      );
      
      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating post:', error);
      return res.status(500).json({ error: 'Failed to create post' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'Post ID is required' });
      }

      await pool.query('DELETE FROM posts WHERE id = $1', [id]);
      
      return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      return res.status(500).json({ error: 'Failed to delete post' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
