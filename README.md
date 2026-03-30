# My App — Gerenciador de Remédios

Aplicativo mobile (iOS/Android/Web) para gerenciar um estoque pessoal de remédios, construído com **Expo + React Native**, **Expo Router** e **TanStack Query**.

---

## Fluxo interno do App

### 1. Inicialização — `app/_layout.tsx`

Ponto de entrada de toda a aplicação. Ao abrir o app:

1. O Expo carrega as fontes (`SpaceMono` e `FontAwesome`) via `useFonts`.
2. A splash screen é mantida visível até as fontes estarem prontas.
3. O `QueryClientProvider` (TanStack Query) é montado ao redor de toda a navegação — ele é o responsável por manter o **cache global** dos dados da API.
4. O `ThemeProvider` do React Navigation aplica o tema claro ou escuro conforme o sistema do usuário.
5. O `Stack` do Expo Router registra todas as rotas disponíveis:
   - `/` → tela inicial (lista de remédios)
   - `/add` → tela de cadastro
   - `/detail/[id]` → tela de edição

---

### 2. Camada de dados

A lógica de comunicação com a API é dividida em duas camadas:

#### `services/medicinesApi.ts` — chamadas HTTP puras

Contém todas as funções que fazem `fetch` para a API REST (`http://127.0.0.1:8000/api/v1`):

| Função             | Método HTTP | Endpoint                  |
|--------------------|-------------|---------------------------|
| `getAll()`         | GET         | `/medicines?per_page=100` |
| `getById(id)`      | GET         | `/medicines/:id`          |
| `create(input)`    | POST        | `/medicines`              |
| `update(id, input)`| PUT         | `/medicines/:id`          |
| `delete(id)`       | DELETE      | `/medicines/:id`          |

#### `hooks/useMedicines.ts` — hooks de estado (TanStack Query)

Cada hook encapsula uma operação e entrega automaticamente os estados `isLoading`, `isError`, `data`, e `isPending`:

| Hook                      | Finalidade                                          |
|---------------------------|-----------------------------------------------------|
| `useMedicinesList()`      | Busca e cacheia a lista de remédios                 |
| `useMedicineDetail(id)`   | Busca e cacheia um remédio específico por ID        |
| `useCreateMedicine()`     | Envia POST e invalida o cache da lista após sucesso |
| `useUpdateMedicine(id)`   | Envia PUT e invalida o cache após sucesso           |
| `useDeleteMedicine()`     | Envia DELETE e invalida o cache após sucesso        |

> **Por que TanStack Query?** Elimina a necessidade de `useState` + `useEffect` + `setLoading` em cada tela. O cache é compartilhado: se você abre um remédio e volta para a lista, ela não faz um novo fetch desnecessário.

---

### 3. Tela Inicial — `app/index.tsx`

- Chama `useMedicinesList()` para obter a lista de remédios do cache/API.
- Enquanto carrega → exibe `ActivityIndicator`.
- Em caso de erro → exibe mensagem com botão "Tentar novamente" que chama `refetch()`.
- Quando carregado → renderiza a lista com `FlatList`, exibindo nome e data de vencimento de cada remédio.
- **Toque em um card** → navega para `/detail/[id]` com o ID do remédio selecionado.
- **Botão "Deletar"** no card → chama `useDeleteMedicine().mutate(id)`. Após o sucesso, o TanStack Query invalida automaticamente o cache e a lista é atualizada sem recarregar a página.
- **Botão "+ Adicionar"** → navega para `/add`.

---

### 4. Tela de Cadastro — `app/add.tsx`

- Formulário com dois campos: **Nome** (obrigatório) e **Data de Vencimento** (opcional).
- Ao tocar em "Adicionar", chama `useCreateMedicine().mutate({ name, expiry_date })`.
- Durante o envio, `isPending` desabilita os campos e o botão mostra "Adicionando...".
- **Sucesso** → exibe alerta e retorna para a tela inicial. O cache da lista é invalidado automaticamente pelo hook, então a tela inicial já mostrará o novo remédio ao retornar.
- **Erro** → exibe alerta de erro.

---

### 5. Tela de Edição — `app/detail/[id].tsx`

- Recebe o `id` do remédio via parâmetro de rota (Expo Router: `useLocalSearchParams`).
- Chama `useMedicineDetail(id)` para buscar os dados do remédio.
- Enquanto carrega → exibe `ActivityIndicator`.
- Quando os dados chegam, o `useEffect` preenche os campos do formulário com `medicine.name` e `medicine.expiry_date`.
- **Botão "Atualizar"** → chama `useUpdateMedicine(id).mutate({ name, expiry_date })`. Após sucesso, retorna para a tela anterior e o cache é invalidado.
- **Botão "Deletar Remédio"** → exibe um `Alert` de confirmação antes de chamar `useDeleteMedicine().mutate(id)`. Após sucesso, retorna para a tela inicial.

---

## Estrutura de arquivos relevante

```
my-app/
├── app/
│   ├── _layout.tsx          # Inicialização: fontes, QueryClient, tema, rotas
│   ├── index.tsx            # Tela inicial: lista de remédios
│   ├── add.tsx              # Tela de cadastro de novo remédio
│   └── detail/
│       └── [id].tsx         # Tela de edição/deleção de remédio
│
├── services/
│   └── medicinesApi.ts      # Funções de fetch para a API REST
│
└── hooks/
    └── useMedicines.ts      # Hooks TanStack Query (cache, loading, mutations)
```

---

## Como rodar

```bash
# Todas as plataformas (abre o menu do Expo)
npm start

# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

> **Requisito:** A API backend deve estar rodando em `http://127.0.0.1:8000/api/v1`.
