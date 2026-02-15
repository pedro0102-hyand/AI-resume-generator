# 🚀 AI Resume Architect

> Plataforma inteligente de criação e otimização de currículos profissionais com tecnologia de IA

![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.128.0-green.svg)
![React](https://img.shields.io/badge/React-19.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## 📋 Sobre o Projeto

O **AI Resume Architect** é uma aplicação web fullstack que revoluciona a forma como profissionais criam seus currículos. Utilizando inteligência artificial do Google Gemini, a plataforma:

- ✨ **Otimiza currículos** automaticamente para vagas específicas
- 🎨 **Oferece templates profissionais** (Moderno, Clássico, Criativo)
- 📄 **Exporta em múltiplos formatos** (PDF e Word)
- 🔒 **Garante segurança** com autenticação JWT
- 💾 **Armazena dados** localmente com SQLite

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React + TS)                   │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Dashboard  │  │    Editor    │  │   Preview    │       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
│           │               │                  │               │
│           └───────────────┴──────────────────┘               │
│                           │                                  │
│                      Axios API Client                        │
└───────────────────────────┼──────────────────────────────────┘
                            │ HTTPS
┌───────────────────────────┼──────────────────────────────────┐
│                      BACKEND (FastAPI)                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              API REST Endpoints                      │    │
│  │  • /auth       • /resumes      • /templates         │    │
│  │  • /ai         • /export                            │    │
│  └─────────────────────────────────────────────────────┘    │
│           │               │                  │               │
│  ┌────────┴────┐  ┌──────┴──────┐  ┌────────┴────────┐     │
│  │   SQLite    │  │   Gemini    │  │   Playwright    │     │
│  │  Database   │  │     AI      │  │   (PDF Gen)     │     │
│  └─────────────┘  └─────────────┘  └─────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Framework**: FastAPI 0.128.0
- **Banco de Dados**: SQLite + SQLAlchemy 2.0.36
- **Autenticação**: JWT (python-jose + passlib)
- **IA**: Google Generative AI (Gemini 2.5 Flash)
- **Templates**: Jinja2 3.1.2
- **Exportação PDF**: Playwright 1.48.0
- **Servidor**: Uvicorn 0.40.0

### Frontend
- **Framework**: React 19.2.0 + TypeScript 5.9.3
- **Build Tool**: Vite 7.2.4
- **Roteamento**: React Router DOM 7.13.0
- **Estado Global**: Zustand 5.0.11
- **Estilização**: Tailwind CSS 4.1.18
- **HTTP Client**: Axios 1.13.4
- **Notificações**: React Hot Toast 2.6.0
- **Ícones**: Lucide React 0.563.0

---

## 📁 Estrutura de Diretórios

```
ai-resume-architect/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── auth.py          # Autenticação e registro
│   │   │       ├── resume.py        # CRUD de currículos
│   │   │       ├── llm.py           # Otimização com IA
│   │   │       ├── templates.py     # Preview HTML
│   │   │       └── export.py        # Exportação PDF/Word
│   │   ├── core/
│   │   │   ├── config.py            # Configurações
│   │   │   ├── database.py          # Conexão SQLite
│   │   │   ├── security.py          # JWT e hashing
│   │   │   └── deps.py              # Dependências
│   │   ├── models/                  # Modelos SQLAlchemy
│   │   ├── schemas/                 # Schemas Pydantic
│   │   ├── services/                # Lógica de negócio
│   │   ├── templates/
│   │   │   └── html/
│   │   │       ├── modern.html      # Template Moderno
│   │   │       ├── classic.html     # Template Clássico
│   │   │       └── creative.html    # Template Criativo
│   │   └── main.py                  # Entry point
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIOptimizationModal.tsx  # Modal de otimização IA
│   │   │   └── SkillsManager.tsx        # Gerenciador de skills
│   │   ├── pages/
│   │   │   ├── Login.tsx                # Página de login
│   │   │   ├── Register.tsx             # Página de registro
│   │   │   ├── Dashboard.tsx            # Lista de currículos
│   │   │   ├── Templates.tsx            # Seleção de template
│   │   │   ├── Editor.tsx               # Editor de currículo
│   │   │   └── Preview.tsx              # Visualização e export
│   │   ├── services/
│   │   │   ├── api.ts                   # Cliente Axios
│   │   │   └── auth.service.ts          # Serviço de auth
│   │   ├── store/
│   │   │   └── useResumeStore.ts        # Store Zustand
│   │   ├── types/                       # Tipos TypeScript
│   │   ├── App.tsx                      # Componente principal
│   │   └── main.tsx                     # Entry point
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

## 🚀 Instalação e Configuração

### Pré-requisitos

- **Python 3.10+**
- **Node.js 20+**
- **npm ou yarn**
- **Chave de API do Google Gemini** ([Obter aqui](https://makersuite.google.com/app/apikey))

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/ai-resume-architect.git
cd ai-resume-architect
```

### 2️⃣ Configurar Backend

```bash
cd backend

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Instalar navegadores do Playwright (para PDF)
playwright install chromium

# Criar arquivo .env
echo "GEMINI_API_KEY=sua_chave_aqui" > .env

# Iniciar servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

O backend estará rodando em: `http://localhost:8000`

### 3️⃣ Configurar Frontend

```bash
cd ../frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em: `http://localhost:3000`

---

## 🔐 Configuração da API do Gemini

1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crie uma nova chave de API
3. Adicione ao arquivo `backend/.env`:

```env
GEMINI_API_KEY=AIzaSy...
```

**Modelos suportados**:
- `gemini-2.5-flash` (recomendado)
- `gemini-2.5-pro`
- `gemini-pro-latest`

---

## 📚 API Endpoints

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/v1/auth/register` | Registrar novo usuário |
| POST | `/api/v1/auth/login-json` | Login com email/senha |

### Currículos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/v1/resumes/` | Criar novo currículo |
| GET | `/api/v1/resumes/` | Listar currículos do usuário |
| GET | `/api/v1/resumes/{id}` | Buscar currículo específico |
| PUT | `/api/v1/resumes/{id}` | Atualizar currículo |
| DELETE | `/api/v1/resumes/{id}` | Deletar currículo |

### IA e Templates

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/v1/ai/generate/{id}` | Otimizar com IA |
| GET | `/api/v1/templates/list` | Listar templates |
| GET | `/api/v1/templates/preview/{id}` | Preview HTML |

### Exportação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/export/pdf/{id}` | Exportar para PDF |
| GET | `/api/v1/export/word/{id}` | Exportar para Word |

---

## 🎨 Templates Disponíveis

### 1. Moderno
- Design limpo e profissional
- Foco em legibilidade
- Seções bem definidas
- Ideal para: Tech, Startups, Vendas

### 2. Clássico
- Layout tradicional e elegante
- Estilo conservador
- Tipografia serif
- Ideal para: Academia, Direito, Medicina

### 3. Criativo
- Layout dinâmico com sidebar
- Cores e destaques visuais
- Design diferenciado
- Ideal para: Design, Marketing, Publicidade

---

## 🤖 Como Funciona a Otimização com IA

### 1. Usuário Preenche Contexto da Vaga
```typescript
{
  title: "Desenvolvedor Full Stack Senior",
  level: "Sênior",
  objective: "Transição para liderança técnica",
  description: "Buscamos um dev com 5+ anos em React e Node..."
}
```

### 2. Backend Envia para Gemini AI
```python
prompt = f"""
Candidate Data: {cv_data}
Job Context: {job_context}

Optimize this resume to match the job requirements.
Return JSON with:
- summary: optimized professional summary
- tailoredExperiences: rewritten experiences
- highlightedSkills: most relevant skills
- suggestedAdditions: missing elements
"""
```

### 3. IA Retorna Currículo Otimizado
```json
{
  "summary": "Senior Full Stack Developer with 6+ years...",
  "tailoredExperiences": [...],
  "highlightedSkills": ["React", "Node.js", "AWS"],
  "suggestedAdditions": ["Add Docker certification"]
}
```

### 4. Frontend Atualiza Dados
Os dados otimizados são automaticamente salvos no banco de dados e exibidos no editor.

---

## 💡 Funcionalidades Principais

### ✅ Autenticação Segura
- Registro com validação de email
- Login com JWT tokens
- Proteção de rotas privadas
- Hash de senhas com bcrypt

### ✅ Editor Intuitivo
- Interface drag-and-drop
- Seções expansíveis
- Auto-save
- Preview em tempo real

### ✅ Gerenciamento de Skills
- Sugestões inteligentes por categoria
- Adicionar/remover facilmente
- Otimização via IA

### ✅ Otimização com IA
- Análise semântica da vaga
- Reescrita de experiências
- Destaque de skills relevantes
- Sugestões de melhorias

### ✅ Exportação Profissional
- PDF de alta qualidade (A4, 1200px)
- Fidelidade ao preview
- Exportação para Word (.doc)
- Download direto

---

## 🧪 Testando a Aplicação

### Teste Manual

1. **Criar Conta**:
   - Acesse `http://localhost:3000/register`
   - Cadastre-se com email e senha

2. **Criar Currículo**:
   - No Dashboard, clique em "Novo"
   - Escolha um template
   - Preencha suas informações

3. **Otimizar com IA**:
   - No Editor, clique em "Otimizar com IA"
   - Cole a descrição da vaga
   - Aguarde a otimização

4. **Exportar**:
   - Clique em "Visualizar"
   - Escolha "Exportar PDF" ou "Exportar Word"

### Endpoints de Teste

```bash
# Health check
curl http://localhost:8000/health

# Listar templates
curl http://localhost:8000/api/v1/templates/list
```

---

## 🐛 Problemas Comuns e Soluções

### Backend não inicia

**Erro**: `ModuleNotFoundError: No module named 'fastapi'`

**Solução**:
```bash
pip install -r requirements.txt
```

### Erro de CORS

**Erro**: `Access to XMLHttpRequest blocked by CORS policy`

**Solução**: Verifique se `allow_origins=["*"]` está configurado no `main.py`

### Gemini API retorna erro

**Erro**: `404 Model not found`

**Solução**:
1. Verifique se a chave de API está correta no `.env`
2. Use um modelo válido: `gemini-2.5-flash`
3. Execute o script de teste:

```bash
cd backend
python modelsapi.py
```

### PDF não gera

**Erro**: `Playwright not installed`

**Solução**:
```bash
playwright install chromium
```

### Frontend não conecta ao backend

**Solução**: Verifique o proxy no `vite.config.ts`:

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
  },
}
```

---


## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

### Padrões de Código

- **Backend**: Seguir PEP 8
- **Frontend**: Usar ESLint + Prettier
- **Commits**: Conventional Commits

---



## 🙏 Agradecimentos

- [Google Gemini AI](https://ai.google.dev/) - Tecnologia de IA
- [FastAPI](https://fastapi.tiangolo.com/) - Framework backend
- [React](https://react.dev/) - Framework frontend
- [Tailwind CSS](https://tailwindcss.com/) - Estilização
- [Lucide](https://lucide.dev/) - Ícones
- Comunidade open source

---

