# 1. Nome do Projeto
Lista de Remedios

# 2. Resumo do Projeto / Visao Geral
Aplicacao para controle domestico de remedios, com foco em acompanhar estoque real com base no tratamento prescrito.
O sistema registra compras, consumo diario e sobras para apoiar a proxima decisao de compra.

# 3. Problema(s) que o Produto Resolve
- Falta de visibilidade sobre quantos comprimidos ainda existem em casa.
- Compras desnecessarias por nao considerar sobras de tratamentos anteriores.
- Dificuldade em planejar reposicao no momento certo (antes de faltar e sem excesso).
- Risco de desperdicio por vencimento de medicamentos estocados sem controle.

# 4. Publico-alvo
- Pessoas e familias que fazem tratamentos recorrentes em casa.
- Pacientes com uso continuo de medicamentos.
- Cuidadores que acompanham tratamento de terceiros.

# 5. Objetivos do Produto
- Permitir controle confiavel de estoque por remedio e por tratamento.
- Ajudar a planejar compras considerando sobras, dose e duracao do tratamento.
- Reduzir desperdicio e evitar compras acima do necessario.
- Melhorar previsibilidade de consumo e reposicao.

# 6. Funcionalidades Principais (Core Features)
- Cadastro de remedios (nome, principio ativo, concentracao, apresentacao, fabricante opcional).
- Registro de compra (quantidade de caixas, comprimidos por caixa, data da compra, validade opcional).
- Cadastro de tratamento (dose por dia, frequencia, data de inicio, duracao prevista).
- Calculo automatico de consumo total previsto e saldo final esperado.
- Controle de estoque atual por remedio (entrada, consumo, sobra).
- Recomendacao de compra com base no saldo atual e no proximo ciclo de tratamento.
- Historico de tratamentos e compras para consulta.

# 7. Escopo / Entregas (MVP)
- API REST para CRUD de remedios, compras e tratamentos.
- Regras de negocio para calcular estoque disponivel, consumo previsto e sobra.
- Endpoint para sugestao de compra (quanto comprar e quando comprar).
- Persistencia com Spring Data JPA e banco H2 para ambiente local.
- Documentacao de endpoints via OpenAPI/Swagger.

# 8. Requisitos Tecnicos (Stack, Integracoes, Plataforma)
- Linguagem: PHP ^8.3.
- Framework: Laravel Framework ^13.0.
- Persistencia: Eloquent ORM (Laravel Eloquent).
- Banco local/dev: SQLite via DB_CONNECTION=sqlite (configurável por .env para MySQL/PostgreSQL/SQL Server).
- Testes: Pest + pest-plugin-laravel.
- Front-end/build: Vite, Tailwind CSS e laravel-vite-plugin.
- Build: Composer e npm/Vite.
- Arquitetura: API REST versionada com rotas /api/v1 e controllers RESTful.

# 9. Exemplo de Regra de Negocio
Se o usuario compra 2 caixas com 8 comprimidos cada (16 total) e o tratamento exige 10 dias com 1 comprimido por dia:
- Consumo previsto: 10 comprimidos.
- Sobra prevista: 6 comprimidos.
- Proxima recomendacao de compra deve considerar esses 6 comprimidos antes de sugerir nova quantidade.

# 10. Requisitos Nao-funcionais
- Dados consistentes e confiaveis para calculos de estoque.
- API com respostas padronizadas e tratamento centralizado de erros.
- Seguranca de dados e validacao de entrada seguindo boas praticas OWASP.
- Codigo organizado para facilitar manutencao e evolucao.

# 11. Funcionalidades Desejaveis (Nice to Have) 
- Alertas de baixo estoque e proximidade de termino de remedio.
- Alertas de validade proxima de vencimento.
- Importacao de receita/plano de tratamento.
- Dashboard com previsao de consumo mensal.
- Multiusuario por residencia (familia/cuidadores).

# 12. Criterios de Sucesso / Metricas
- Usuario consegue registrar compra e tratamento e obter saldo previsto sem calculo manual.
- Sistema informa corretamente a necessidade de compra para o proximo ciclo.
- Reducao percebida de compras desnecessarias e de desperdicio por sobra.
- Tempo medio para registrar uma compra ou tratamento baixo o suficiente para uso cotidiano.
