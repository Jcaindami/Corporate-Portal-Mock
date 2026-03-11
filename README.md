# Corporate Portal - Full-Stack Architecture Mock

## Descrição

Este repositório é uma demonstração arquitetural de um portal corporativo Full-Stack (React.js + Node.js). Ele foi projetado para ilustrar a estruturação de um sistema real de backoffice, gestão de processos e controle de acessos (RBAC), utilizando dados mockados e sanitizados.

O objetivo deste projeto é demonstrar proficiência em integrações de API RESTful, segurança (autenticação JWT e hash de senhas), manipulação de banco de dados relacional e construção de interfaces dinâmicas, escaláveis e protegidas.

## Principais Funcionalidades Demonstradas:

- Autenticação e Segurança: Fluxo completo de Login com encriptação (bcryptjs), geração e validação de tokens JWT, e middlewares de proteção de rotas privadas.

- Role-Based Access Control (RBAC): Renderização condicional de componentes no Front-end e bloqueio de endpoints no Back-end com base no perfil do usuário (Admin, Gestor, Colaborador).

- Data Seeding & Mocking: Script de população automatizada de banco de dados (seed.js com Faker.js) para facilitar testes locais e validação de paginação/filtros.

- Arquitetura Modular: Separação clara de responsabilidades entre rotas, controladores, middlewares e configurações de banco de dados.