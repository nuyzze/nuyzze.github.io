# 🎨 Sitefy - Criador de Sites Visual

Uma plataforma completa para criar sites de forma visual, similar ao Figma ou Canva, com geração automática de código HTML, CSS e JavaScript.

## ✨ Funcionalidades

### 🔐 Autenticação
- Login e cadastro com email/senha via Firebase Authentication
- Sessão persistente
- Logout seguro

### 🎯 Editor Visual
- Interface drag & drop intuitiva
- 6 tipos de elementos: Header, Texto, Botão, Imagem, Container e Formulário
- Edição de propriedades em tempo real
- Sistema de desfazer/refazer
- Controles de edição (desfazer, refazer, limpar)

### 📁 Gerenciamento de Projetos
- Criar novos projetos
- Salvar projetos automaticamente
- Listar projetos do usuário
- Carregar projetos existentes
- Persistência no Firebase Firestore

### 💻 Geração de Código
- Geração automática de HTML, CSS e JavaScript
- Visualização em abas separadas
- Botão de copiar código
- Preview em tempo real

### 📱 Design Responsivo
- Interface totalmente responsiva
- Funciona em desktop, tablet e mobile
- Design moderno e intuitivo

## 🚀 Como Usar

### 1. Configuração do Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative o Authentication (Email/Password)
4. Crie um banco Firestore
5. Copie as credenciais do projeto

### 2. Configuração do Código

Edite o arquivo `app.js` e substitua a configuração do Firebase:

```javascript
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    projectId: "SEU_PROJETO_ID",
    storageBucket: "SEU_PROJETO.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID",
    databaseURL: "https://SEU_PROJETO.firebaseio.com"
};
```

### 3. Configuração do Backend

O Sitefy está configurado para trabalhar com uma API REST. Configure as seguintes rotas no seu backend:

```
POST /api/projetos/:uid - Criar projeto
GET /api/projetos/:uid - Listar projetos
GET /api/projetos/:uid/:id - Detalhes do projeto
PUT /api/projetos/:uid/:id - Atualizar projeto
DELETE /api/projetos/:uid/:id - Deletar projeto
```

### 4. Estrutura de Dados

Cada projeto salvo contém:

```javascript
{
    id: "projeto_id",
    uid: "user_id",
    nome: "Nome do Projeto",
    elementos: [...], // Array com elementos visuais
    html: "...", // Código HTML gerado
    css: "...", // Código CSS gerado
    js: "...", // Código JavaScript gerado
    criadoEm: "2024-01-01T00:00:00.000Z",
    atualizadoEm: "2024-01-01T00:00:00.000Z"
}
```

## 📁 Estrutura de Arquivos

```
sitefy/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── app.js             # Lógica JavaScript
└── README.md          # Este arquivo
```

## 🎮 Como Usar o Editor

### 1. Login/Cadastro
- Acesse a aplicação
- Faça login ou crie uma conta
- Após login, você será redirecionado para o editor

### 2. Criar um Projeto
- Clique em "Novo Projeto" no header
- Digite o nome do projeto
- Clique em "Criar Projeto"

### 3. Adicionar Elementos
- Arraste elementos da sidebar para o canvas
- Clique em um elemento para selecioná-lo
- Use o painel de propriedades para editar

### 4. Editar Elementos
- Selecione um elemento no canvas
- Use o painel de propriedades à direita
- Edite conteúdo, cor, tamanho, alinhamento

### 5. Salvar Projeto
- Clique em "Salvar Projeto" no header
- O projeto será salvo automaticamente

### 6. Ver Código
- Clique em "Ver Código" no header
- Visualize HTML, CSS e JavaScript gerados
- Use os botões de copiar para cada seção

### 7. Preview
- Clique em "Visualizar" no header
- Veja como o site ficará no navegador

## ⌨️ Atalhos de Teclado

- `Ctrl/Cmd + S` - Salvar projeto
- `Ctrl/Cmd + Z` - Desfazer
- `Ctrl/Cmd + Shift + Z` - Refazer
- `Escape` - Fechar modais / Deselecionar elemento

## 🎨 Elementos Disponíveis

### Header
- Título principal da página
- Estilo: fonte grande, negrito, centralizado

### Texto
- Parágrafo de texto
- Editável: conteúdo, cor, tamanho, alinhamento

### Botão
- Botão clicável
- Editável: texto, cor, tamanho

### Imagem
- Imagem com placeholder
- Editável: URL da imagem, tamanho

### Container
- Container para agrupar elementos
- Editável: padding, background, borda

### Formulário
- Formulário básico
- Campos: nome e email
- Botão de envio

## 🔧 Personalização

### Adicionar Novos Elementos

Para adicionar novos tipos de elementos, edite o objeto `elementTemplates` no arquivo `app.js`:

```javascript
const elementTemplates = {
    // ... elementos existentes
    novoElemento: {
        type: 'novoElemento',
        content: 'Conteúdo padrão',
        styles: {
            // estilos padrão
        }
    }
};
```

### Modificar Estilos

Edite o arquivo `styles.css` para personalizar a aparência da interface.

### Adicionar Funcionalidades

O código está bem estruturado e modular. Você pode facilmente adicionar novas funcionalidades editando o arquivo `app.js`.

## 🌐 Deploy

### Opção 1: Hospedagem Estática
- Netlify, Vercel, GitHub Pages
- Configure as variáveis de ambiente para Firebase

### Opção 2: Servidor Local
- Use um servidor local como Live Server (VS Code)
- Configure o CORS no seu backend

### Opção 3: Acode (Mobile)
- Como mencionado, funciona perfeitamente no Acode
- Basta abrir os arquivos e executar

## 🔒 Segurança

- Autenticação via Firebase Auth
- Regras de segurança no Firestore
- Validação de dados no frontend e backend
- Sanitização de HTML gerado

## 📱 Compatibilidade

- ✅ Chrome, Firefox, Safari, Edge
- ✅ Desktop, Tablet, Mobile
- ✅ iOS Safari, Chrome Mobile
- ✅ Android Chrome, Samsung Internet

## 🐛 Solução de Problemas

### Erro de Autenticação
- Verifique as credenciais do Firebase
- Confirme se o Authentication está ativo

### Erro de API
- Verifique se o backend está rodando
- Confirme as rotas da API
- Verifique o CORS

### Elementos não aparecem
- Verifique o console do navegador
- Confirme se o Firebase está inicializado

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a documentação
2. Procure por issues similares
3. Abra uma nova issue com detalhes

---

**Sitefy** - Transforme suas ideias em sites reais de forma visual! 🚀