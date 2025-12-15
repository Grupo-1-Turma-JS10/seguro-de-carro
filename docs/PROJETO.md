# PROJETO INTEGRADOR TURMA JS10 GRUPO 1 - CRUD de Seguro de Carro

## Descrição Geral

Este projeto é uma **API RESTful** desenvolvida com **NestJS** para gerenciar seguros de automóveis, permitindo operações de criação, leitura, atualização e exclusão (CRUD) de veículos e contratos de seguro.

O sistema possibilita registrar informações detalhadas sobre cada veículo e vincular contratos conforme o tipo de cobertura escolhida, garantindo organização, segurança e clareza no gerenciamento dos dados.

### Público-alvo

Motoristas de carros de aplicativo que precisam de uma solução prática e totalmente digital para contratar, acompanhar e administrar seus seguros de forma simples e sem burocracia, garantindo proteção e agilidade no dia a dia de trabalho.

## Estrutura de Dados

O projeto utiliza duas entidades principais com relação **1:N** (um Veículo pode ter vários Seguros):

### tb_veiculos

| Campo | Tipo | Nullable |
|-------|------|----------|
| **id** | int | NOT NULL |
| nome | varchar(100) | NOT NULL |
| cpf_cnpj | varchar(14) | NOT NULL |
| data_nascimento | date | NOT NULL |
| endereco | varchar(500) | NOT NULL |
| email | varchar(100) | NOT NULL |
| telefone | varchar(15) | NOT NULL |
| marca | varchar(100) | NOT NULL |
| modelo | varchar(100) | NOT NULL |
| ano | smallint | NOT NULL |
| placa | varchar(15) | NOT NULL |
| data_criacao | timestamp | NOT NULL |
| data_atualizacao | timestamp | NOT NULL |

### tb_seguros

| Campo | Tipo | Nullable |
|-------|------|----------|
| **id** | int | NOT NULL |
| valor | decimal(10,2) | NOT NULL |
| desconto | decimal(10,2) | NOT NULL |
| status | varchar(50) | NOT NULL |
| cobertura | varchar(100) | NOT NULL |
| data_criacao | timestamp | NOT NULL |
| data_atualizacao | timestamp | NOT NULL |
| **veiculoId** | int | NOT NULL |

**Relação:** Um Veículo (1) → Muitos Seguros (N)

## Tecnologias Utilizadas

- 🏗️ **NestJS** — Framework Node.js progressivo
- 🗄️ **TypeORM** — ORM para TypeScript
- 🐘 **PostgreSQL** — Banco de dados relacional
- ⚙️ **TypeScript** — Linguagem de programação tipada
- 🚀 **Node.js** — Runtime JavaScript

## Squad

| Nome | Função |
|------|--------|
| Eduardo Pagel | Dev. |
| Daniel Ribeiro | Dev. |
| Joselaine Bechaire | Dev. |
| Marcos Vinicius | Tester |
| Michael Sales | Dev. |
| Gabriela Lima | P.O. |
| Juliana Matsuda | Dev. |

---

**Desenvolvido com ❤️ pelo Grupo 1 - Turma JS10**
