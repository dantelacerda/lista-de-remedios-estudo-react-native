# 📱 App de Remédios - MVP

Aplicação mobile/web para gerenciar remédios construída com **React Native + Expo**.

## ✨ Recursos

- 📋 **Listar remédios** - Visualize todos os seus remédios cadastrados
- ➕ **Cadastrar remédio** - Adicione novos remédios com nome e data de vencimento
- 🗑️ **Deletar remédio** - Remova remédios com confirmação
- 🔄 **Pull-to-refresh** - Atualize a lista puxando para baixo
- ✅ **Validação** - Formulário com validação robusta
- 📱 **Responsivo** - Funciona em web, iOS e Android

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+ instalado
- API Laravel rodando em `http://127.0.0.1:8000`

### Verificar API

```bash
curl http://127.0.0.1:8000/api/v1/health
```

Você deve receber:
```json
{
  "status": "ok",
  "message": "API v1 está funcionando corretamente",
  "timestamp": "...",
  "version": "1.0.0"
}
```

### Iniciar o App

```bash
# Instalar dependências (se necessário)
npm install

# Iniciar Expo
npm start

# Depois escolha uma opção:
# w - Web
# i - iOS
# a - Android
```

## 📁 Estrutura do Projeto

```
my-app/
├── app/
│   ├── _layout.tsx                    # Root layout
│   └── medicine/                      # Módulo de remédios
│       ├── _layout.tsx                # Tab navigator
│       ├── list.tsx                   # Tela de listagem
│       └── create.tsx                 # Tela de cadastro
│
├── components/                        # Componentes reutilizáveis
│   ├── Button.tsx
│   ├── LoadingSpinner.tsx
│   ├── ErrorMessage.tsx
│   └── MedicineCard.tsx
│
├── services/                          # API e serviços
│   ├── api.ts                         # Cliente HTTP
│   └── medicines.ts                   # CRUD de remédios
│
├── hooks/                             # Custom hooks
│   └── useMedicines.ts                # State management
│
├── types/                             # TypeScript types
│   └── medicine.ts                    # Tipos de dados
│
└── package.json
```

## 🎯 Funcionalidades

### Tela 1: Meus Remédios

- ✅ Lista todos os remédios da API
- ✅ Pull-to-refresh para atualizar
- ✅ Cards com nome e data de vencimento
- ✅ Indicador de remédios vencidos
- ✅ Botão para deletar cada remédio
- ✅ Feedback de carregamento e erro

### Tela 2: Adicionar Remédio

- ✅ Formulário com 2 campos:
  - **Nome** (obrigatório, mínimo 3 caracteres)
  - **Data de Vencimento** (opcional, formato YYYY-MM-DD)
- ✅ Validação de entrada
- ✅ Feedback de sucesso/erro
- ✅ Desabilita inputs durante carregamento

## 🎨 Design

- **Cores**: Azul (#3b82f6) para primário, Vermelho (#ef4444) para ações destrutivas
- **Tipografia**: Consistente com tamanhos e pesos bem definidos
- **Layout**: Mobile-first e responsivo para todas as telas
- **Componentes**: Reutilizáveis com estados visuais claros

## 🔌 API Endpoints Utilizados

- `GET /api/v1/medicines` - Listar remédios
- `POST /api/v1/medicines` - Criar remédio
- `DELETE /api/v1/medicines/{id}` - Deletar remédio
- `GET /api/v1/health` - Verificar saúde da API

## 📦 Dependências Principais

- `react-native` - Framework UI
- `expo` - Plataforma de desenvolvimento
- `expo-router` - Roteamento
- `@react-navigation` - Navegação

## 🧪 Testes

### Listar Remédios

1. Abra a aba "Meus Remédios"
2. Veja a lista de remédios carregando
3. Puxe para cima para atualizar

### Cadastrar Remédio

1. Abra a aba "Adicionar"
2. Preencha o nome (ex: "Dipirona 500mg")
3. Opcionalmente, adicione data (ex: "2026-12-31")
4. Clique em "Cadastrar Remédio"
5. Veja o novo remédio na lista

### Deletar Remédio

1. Na lista, clique "Deletar" em um remédio
2. Confirme a exclusão no alert
3. O remédio é removido da lista

## 🐛 Troubleshooting

### App não conecta à API

```bash
# Verifique se a API está rodando
curl http://127.0.0.1:8000/api/v1/health

# Limpe cache do Expo
npm start --reset-cache
```

### Erros de compilação TypeScript

```bash
# Verifique tipos
npx tsc --noEmit
```

### Forma preto/branco?

Verifique se está usando o iOS dark mode. O app suporta ambos os temas.

## 📚 Documentação Adicional

- `TESTING.md` - Guia completo de testes
- `.github/project-context.md` - Contexto do projeto
- `.github/api-consumed.md` - Documentação da API

## 🎯 Próximos Passos

Para expandir este MVP:

- [ ] Tela de detalhes com edição
- [ ] Registro de compras
- [ ] Registro de tratamentos
- [ ] Cálculo automático de estoque
- [ ] Alertas de vencimento
- [ ] Persistência com AsyncStorage
- [ ] Testes E2E
- [ ] Darkmode customizado
- [ ] Suporte offline

## 📝 Licença

MIT

## 👨‍💻 Desenvolvido com ❤️

Implementação completa de um MVP de app de remédios com React Native e Expo.
