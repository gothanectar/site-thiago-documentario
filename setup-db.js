const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function setupDatabase() {
  try {
    console.log('Conectando ao banco de dados...');
    
    // Ler e executar o schema
    const schema = fs.readFileSync('./schema.sql', 'utf8');
    
    await pool.query(schema);
    
    console.log('✅ Banco de dados configurado com sucesso!');
    console.log('✅ Tabelas criadas: users, posts');
    console.log('✅ Usuário criador inserido: Thiago Augusto Hetzel Silva');
    
    await pool.end();
  } catch (error) {
    console.error('❌ Erro ao configurar banco de dados:', error);
    process.exit(1);
  }
}

setupDatabase();
