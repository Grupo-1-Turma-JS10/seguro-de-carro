# Seguro de Carro

Seguro de Carro é uma API REST modular para gerenciar veículos e apólices de seguro. Foi desenvolvida com foco em:

- operações CRUD para Veículos e Seguros;
- regras de negócio: 
  - desconto automático de 20% para veículos com mais de 10 anos; 
  - cálculo de valor do seguro baseado na cobertura escolhida, sendo `básica: (R$ 2.000)`, `intermediária: (R$ 3.500)` ou `completa: (R$ 5.000)`;
  - seguro só pode ser criado para maiores de 18 anos;
- validação de entrada com feedback claro ao cliente e com tratamento de erros adequado;
- arquitetura modular (módulos separados por responsabilidade) para facilitar manutenção e testes futuramente.

A implementação usa NestJS como framework, TypeORM para persistência e MySQL como banco de dados. O projeto serve como base para um sistema de seguros com exemplos práticos de integração entre entidades (Veículo ↔ Seguro) e tratamento de erros/validações.

## Conteúdo
- `src/veiculo` — entidade, controller e serviço para veículos
- `src/seguro` — entidade, controller e serviço para seguros

## Tecnologias utilizadas

O projeto utiliza as seguintes tecnologias e bibliotecas principais:

![NestJS](https://img.shields.io/badge/NestJS-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-%231572B6.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-000000.svg?style=for-the-badge&logo=typeorm&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-%23339933.svg?style=for-the-badge&logo=node.js&logoColor=white)

- 🏗️ NestJS — framework Node.js para construir APIs escaláveis e testáveis
- ⚙️ TypeScript — tipagem estática para JavaScript
- 🗄️ TypeORM — ORM para mapeamento objeto-relacional
- 🐬 MySQL (mysql2) — banco de dados relacional
- 🔒 class-validator / class-transformer — validação e transformação de DTOs
- 🌿 dotenv / @nestjs/config — carregamento de variáveis de ambiente


## Pré-requisitos
- Node.js (recomendo 18+)
- npm
- MySQL (ou compatível) configurado e acessível

## Variáveis de ambiente
Crie um arquivo `.env` na raiz (não é commitado). As variáveis mais importantes usadas pelo projeto são:

```
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=secret
DB_DATABASE=seguro_de_carro
NODE_ENV=development
PORT=3000
```

> O projeto carrega variáveis com `@nestjs/config` — veja `src/app.module.ts` para detalhes.

## Instalação

```bash
npm install
```

## Criar banco (script)
Há um script utilitário em `scripts/create-db.mjs` que usa as variáveis de ambiente para criar o banco (útil em dev):

```bash
npm run create-db
```

## Rodar em modo desenvolvimento

```bash
npm run start:dev
```

## Endpoints principais

As rotas seguem o padrão REST definidas nos controllers em `src/*/controller`.

- POST /veiculo — cria um veículo
- GET /veiculo — lista veículos
- GET /veiculo/:id — busca veículo por id
- PUT /veiculo — atualiza veículo
- DELETE /veiculo/:id — remove veículo

- POST /seguro — cria um seguro (associa a um veículo existente)
- GET /seguro — lista seguros
- GET /seguro/:id — busca seguro por id
- PUT /seguro — atualiza seguro
- DELETE /seguro/:id — remove seguro


## Exemplos curl

Exemplos rápidos de como testar os endpoints usando `curl`. Substitua `localhost:3000` e `id` conforme seu ambiente.

### Veículo

- Criar veículo

```bash
curl -X POST http://localhost:3000/veiculo \
	-H "Content-Type: application/json" \
	-d '{
		"nome": "João da Silva",
		"cpf_cnpj": "12345678901",
		"data_nascimento": "1985-07-20",
		"endereco": "Rua das Flores, 123, São Paulo, SP",
		"email": "joao.silva@example.com",
		"telefone": "+5511999999999",
		"marca": "Volkswagen",
		"modelo": "Gol",
		"ano": 2018,
		"placa": "ABC1D23"
	}'
```

- Listar veículos

```bash
curl http://localhost:3000/veiculo
```

- Buscar veículo por id

```bash
curl http://localhost:3000/veiculo/1
```

- Atualizar veículo

```bash
curl -X PUT http://localhost:3000/veiculo \
	-H "Content-Type: application/json" \
	-d '{
		"id": 1,
		"marca": "Volkswagen",
		"modelo": "Gol",
		"ano": 2019,
		"placa": "ABC1D23"
	}'
```

- Deletar veículo

```bash
curl -X DELETE http://localhost:3000/veiculo/1
```

### Seguro

- Criar seguro (associando a um veículo existente)

```bash
curl -X POST http://localhost:3000/seguro \
	-H "Content-Type: application/json" \
	-d '{
		"valor": 0,
		"desconto": 0,
		"status": "ativo",
		"cobertura": "completo",
		"veiculo": { "id": 1 }
	}'
```
> Observação: o `SeguroService` calcula `valor` e `desconto` automaticamente quando `valor` é enviado como `0` ou omitido, desde que `veiculo.id` e `cobertura` sejam válidos.

- Listar seguros

```bash
curl http://localhost:3000/seguro
```

- Buscar seguro por id

```bash
curl http://localhost:3000/seguro/1
```

- Atualizar seguro

```bash
curl -X PUT http://localhost:3000/seguro \
	-H "Content-Type: application/json" \
	-d '{
		"id": 1,
		"valor": 3000.00,
		"desconto": 0.00,
		"status": "ativo",
		"cobertura": "completo",
		"veiculo": { "id": 1 }
	}'
```

- Deletar seguro

```bash
curl -X DELETE http://localhost:3000/seguro/1
```

## Contato
- Mantenha este README atualizado com instruções do seu ambiente local (variáveis de ambiente, versão do MySQL etc.).


