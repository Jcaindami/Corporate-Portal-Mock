require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { fakerPT_PT: faker } = require('@faker-js/faker');

async function seedDatabase() {
    console.log('🌱 A iniciar a geração de dados fictícios...');

    // Conexão à base de dados local (configurada via .env.example)
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'corporate_portal_mock',
    });

    try {
        // 1. Criação das tabelas (caso não existam)
        console.log('📦 A verificar e a criar tabelas...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS dtbUsuariosSite (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                senha VARCHAR(255) NOT NULL,
                perfil ENUM('Admin', 'Gestor', 'Colaborador') DEFAULT 'Colaborador',
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS dtbVagas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                titulo VARCHAR(255) NOT NULL,
                departamento VARCHAR(100) NOT NULL,
                descricao TEXT,
                status ENUM('Aberta', 'Em Progresso', 'Fechada') DEFAULT 'Aberta',
                data_abertura DATE,
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Limpar dados antigos para evitar duplicações a cada execução
        await connection.query('TRUNCATE TABLE dtbVagas');
        await connection.query('TRUNCATE TABLE dtbUsuariosSite');

        // 2. Geração de Utilizadores (dtbUsuariosSite)
        console.log('👥 A gerar utilizadores fictícios...');
        const passwordHash = await bcrypt.hash('senhaTeste123', 10);
        
        // Criar um Admin fixo para facilitar o teste do recrutador
        await connection.query(
            'INSERT INTO dtbUsuariosSite (nome, email, senha, perfil) VALUES (?, ?, ?, ?)',
            ['Administrador Teste', 'admin@mock.local', passwordHash, 'Admin']
        );

        // Criar 15 utilizadores aleatórios
        for (let i = 0; i < 15; i++) {
            await connection.query(
                'INSERT INTO dtbUsuariosSite (nome, email, senha, perfil) VALUES (?, ?, ?, ?)',
                [
                    faker.person.fullName(),
                    faker.internet.email(),
                    passwordHash,
                    faker.helpers.arrayElement(['Gestor', 'Colaborador'])
                ]
            );
        }

        // 3. Geração de Vagas (dtbVagas)
        console.log('💼 A gerar vagas de emprego fictícias...');
        const departamentos = ['Tecnologia', 'Recursos Humanos', 'Financeiro', 'Operações', 'Marketing'];
        
        for (let i = 0; i < 25; i++) {
            await connection.query(
                'INSERT INTO dtbVagas (titulo, departamento, descricao, status, data_abertura) VALUES (?, ?, ?, ?, ?)',
                [
                    faker.person.jobTitle(),
                    faker.helpers.arrayElement(departamentos),
                    faker.lorem.paragraphs(2),
                    faker.helpers.arrayElement(['Aberta', 'Em Progresso', 'Fechada']),
                    faker.date.recent({ days: 60 })
                ]
            );
        }

        console.log('✅ Base de dados populada com sucesso! Pode iniciar a aplicação.');

    } catch (error) {
        console.error('❌ Erro ao popular a base de dados:', error);
    } finally {
        await connection.end();
    }
}

seedDatabase();