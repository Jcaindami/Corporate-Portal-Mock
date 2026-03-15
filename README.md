# Corporate Portal - Full-Stack Architecture Mock

## Descrição

Este repositório é uma demonstração arquitetural de um portal corporativo Full-Stack (React.js + Node.js). Ele foi projetado para ilustrar a estruturação de um sistema real de backoffice, gestão de processos e controle de acessos (RBAC), utilizando dados mockados e sanitizados.

O objetivo deste projeto é demonstrar proficiência em integrações de API RESTful, segurança (autenticação JWT e hash de senhas), manipulação de banco de dados relacional e construção de interfaces dinâmicas, escaláveis e protegidas.

## Principais Funcionalidades Demonstradas:

- **Autenticação e Segurança:** Fluxo completo de Login com encriptação (`bcryptjs`), geração e validação de tokens JWT, e middlewares de proteção de rotas privadas.
- **Role-Based Access Control (RBAC):** Renderização condicional de componentes no Front-end e bloqueio de endpoints no Back-end com base no perfil do usuário (Admin, Gestor, Colaborador).
- **Data Seeding & Mocking:** Script de população automatizada de banco de dados (`seed.js` com `Faker.js`) para facilitar testes locais e validação de paginação/filtros.
- **Arquitetura Modular:** Separação clara de responsabilidades entre rotas, controladores, middlewares e configurações de banco de dados.

## 🛠️ Tecnologias Utilizadas

**Front-end:**
- React.js (v18)
- React Router Dom (Gestão de rotas e Route Guards)
- Tailwind CSS (Estilização utilitária e responsiva)

**Back-end:**
- Node.js & Express.js
- JSON Web Token (JWT) para sessões seguras
- Bcrypt.js para hash de senhas

**Banco de Dados:**
- MySQL
- `mysql2` (Driver Promise-based)
- `@faker-js/faker` (Geração de dados sintéticos)

---

## 🚀 Como replicar e testar o projeto localmente

Siga as instruções abaixo para configurar o ambiente de desenvolvimento na sua máquina.

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/)
- Um servidor MySQL rodando localmente (pode utilizar XAMPP, WAMP, Docker, etc.)
- Git

### 1. Clonar o Repositório
```bash
git clone [https://github.com/Jcaindami/Corporate-Portal-Mock.git](https://github.com/Jcaindami/Corporate-Portal-Mock.git)
cd Corporate-Portal-Mock
```

### 2. Configurar o Banco de Dados
Abra o seu gerenciador de banco de dados (DBeaver, MySQL Workbench, phpMyAdmin) e crie um banco de dados vazio chamado:

CREATE DATABASE corporate_portal_mock;


### 3. Configurar e Iniciar a API (Back-end)
Abra um terminal, navegue até a pasta do servidor e instale as dependências:
```bash
cd server
npm install
```

Na pasta /server, crie um arquivo .env (ou renomeie o .env.example) com as seguintes variáveis de ambiente, ajustando a senha do banco se necessário:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=corporate_portal_mock
JWT_SECRET=super_segredo_jwt_para_testes_locais
PORT=5000


Agora, execute o script de "Seeding" para criar as tabelas e popular o banco com dados falsos gerados pelo Faker.js:
```bash
npm run seed
```

Por fim, inicie o servidor da API:
```bash
npm start
```
A API estará rodando em http://localhost:5000.

### 4. Configurar e Iniciar a Interface (Front-end)
Abra um novo terminal (mantenha o terminal do back-end rodando), certifique-se de estar na raiz do projeto e instale as dependências do React:
```bash
# Na pasta raiz do projeto (Corporate-Portal-Mock)
npm install
```
Inicie a aplicação Front-end:
```bash
npm start
```
O navegador abrirá automaticamente em http://localhost:3000.

---

## 🔑 Credenciais de Teste

Para acessar o sistema e testar as funcionalidades de permissões e rotas protegidas (RBAC), utilize as credenciais geradas automaticamente pelo script de banco de dados:

Email: admin@mock.local

Senha: senhaTeste123

(Nota: Este usuário possui perfil de Admin, o que permite aprovar e reprovar solicitações, visualizando todos os recursos ocultos da interface).