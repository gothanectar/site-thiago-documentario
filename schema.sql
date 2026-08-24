-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(255) DEFAULT 'Membro Autodidata',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Posts
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    html TEXT NOT NULL,
    user_name VARCHAR(255) DEFAULT 'Usuário Criativo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir usuário criador do app
INSERT INTO users (name, email, role) 
VALUES ('Thiago Augusto Hetzel Silva', 'thiago@cuvida.com', 'Massoterapeuta | Criador')
ON CONFLICT (email) DO NOTHING;

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
