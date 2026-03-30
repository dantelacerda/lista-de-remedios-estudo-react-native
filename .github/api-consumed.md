# Este projeto consumirá a seguinte API com os seguintes endpoints

Por padrão a aplicação ficará disponível em `http://127.0.0.1:8000`.

## Rotas principais da API

A API está versionada em `/api/v1` e também mantém rotas legacy em `/api`.

### Endpoints v1

- `GET /api/v1/medicines`
  - Lista todos os remédios.
  - Suporta paginação com `?page=1&per_page=15`.

- `POST /api/v1/medicines`
  - Cria um novo remédio.
  - Body JSON esperado:
    ```json
    {
      "name": "Dipirona 500mg",
      "expiry_date": "2026-12-31"
    }
    ```

- `GET /api/v1/medicines/{id}`
  - Retorna os dados de um remédio específico.

- `PUT /api/v1/medicines/{id}`
  - Atualiza todos os campos de um remédio.
  - Body JSON esperado:
    ```json
    {
      "name": "Dipirona 500mg - Atualizado",
      "expiry_date": "2027-12-31"
    }
    ```

- `PATCH /api/v1/medicines/{id}`
  - Atualização parcial de um remédio.
  - Envie apenas os campos a serem alterados.

- `DELETE /api/v1/medicines/{id}`
  - Exclui um remédio.

- `GET /api/v1/medicines/expiring`
  - Retorna remédios que expiram em até X dias.
  - Query params opcionais:
    - `days` (integer, padrão 30)
    - `sort_by` (`expiry_date`, `created_at`, `name`)
    - `include_expired` (`true` ou `false`)
  - Exemplo:
    `/api/v1/medicines/expiring?days=7&sort_by=expiry_date&include_expired=true`

- `GET /api/v1/health`
  - Retorna status de saúde da API.