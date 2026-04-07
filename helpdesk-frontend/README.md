# Helpdesk Frontend — FlowPilot / Raposo Plásticos

Frontend em **Vue 3 + Tailwind CSS + PrimeVue** para o sistema de Helpdesk.

## Stack

- **Vue 3** — Composition API com `<script setup>`
- **Vue Router 4** — Rotas com guard de autenticação
- **Tailwind CSS 3** — Utilitários de estilo
- **PrimeVue 4** — Componentes UI (DataTable, Dialog, Select, Toast…)
- **Axios** — Cliente HTTP com interceptor de JWT

---

## Estrutura do projeto

```
src/
├── composables/
│   ├── useAuth.js       # Login, logout, usuário atual
│   └── useTickets.js    # CRUD de tickets, módulos e comentários
├── components/
│   ├── AppHeader.vue    # Header com logo, data e avatar
│   ├── AppSidebar.vue   # Sidebar recolhível
│   ├── StatusBadge.vue  # Badge de status colorido
│   ├── SectorBadge.vue  # Badge de setor colorido
│   └── OpenTicketModal.vue  # Modal de abertura de chamado com campos dinâmicos
├── views/
│   ├── LoginView.vue    # Tela de login
│   ├── MainLayout.vue   # Shell principal (header + sidebar + router-view)
│   ├── HelpdeskView.vue # Lista de chamados com filtros e stats
│   └── TicketDetailView.vue  # Detalhe + comentários
├── services/
│   └── api.js           # Instância Axios configurada
├── router/
│   └── index.js         # Rotas e guards
├── App.vue
├── main.js
└── style.css
```

---

## Configuração e execução

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variável de ambiente

```bash
cp .env.example .env
# Edite VITE_API_URL com o endereço do seu backend NestJS
```

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

### 4. Build para produção

```bash
npm run build
```

---

## Funcionalidades

- ✅ **Login** com JWT (e-mail + senha)
- ✅ **Lista de chamados** com busca, filtro por status e setor, e cards de stats
- ✅ **Abertura de chamado** via modal com campos dinâmicos vindos do `schema_fields` do backend
- ✅ **Detalhe do chamado** com descrição, campos do payload, e atualização de status
- ✅ **Comentários** com suporte a `@menção` e envio por Ctrl+Enter
- ✅ **Sidebar recolhível** com tooltips
- ✅ **Notificações toast** para feedback de ações
- ✅ **Skeleton loaders** durante carregamentos

---

## Integração com o Backend

O frontend espera os seguintes endpoints no NestJS:

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/login` | Login → `{ access_token, user }` |
| GET | `/auth/me` | Usuário autenticado |
| GET | `/helpdesk-modules` | Módulos ativos da empresa |
| GET | `/tickets` | Lista de tickets do usuário |
| POST | `/tickets` | Abrir novo chamado |
| PATCH | `/tickets/:id` | Atualizar status |
| GET | `/tickets/:id/comments` | Comentários do ticket |
| POST | `/tickets/comment` | Adicionar comentário |
