# Deploy · alô, uai (antigo instagram-feed)

Plano de ação para publicar a API e o feed web em hospedagem gratuita. O app React Native (`instarocket/`) fica fora do deploy.

> ✅ **Marca resolvida.** O projeto passou a se chamar **alô, uai** (`alo-uai` nos slugs), com símbolo, favicon, ícones e paleta próprios. O nome e o logo de rede social que o projeto imitava foram removidos do código, do README e dos serviços. Falta só renomear o repositório no GitHub (Etapa 2).

## 1. Desafio

Colocar no ar, sem custo, o feed de fotos alô, uai, com API Express 5 + MongoDB, **upload e redimensionamento de imagens (sharp)** e **curtidas em tempo real (Socket.IO)**, depois de um vazamento: a senha do usuário `dbFeedInstagram` do MongoDB Atlas ficou no histórico do Git (mesmo cluster do aircnc).

## 2. Conteúdo

### Decisão de hospedagem

| Opção | Resultado |
|---|---|
| **Render: API (web service Free) + web (site estático) + MongoDB Atlas M0 (escolhida)** | Blueprint pronto em `render.yaml`; o Render mantém o WebSocket e instala o `sharp` para Linux no build |
| Web no GitHub Pages + API no Render | Funciona, mas o `BrowserRouter` exigiria `base`, `basename` e `404.html`; o estático do Render já tem o rewrite e fica no mesmo Blueprint |
| API em funções serverless (Vercel/Netlify) | Não mantêm WebSocket nem disco para as imagens |
| VPS | Fora da regra do portfólio (só hospedagem gratuita) |

### Banco: um cluster M0 para todos os apps

Recomendação para o lote (my-money-app, aircnc e alô, uai): **um único cluster M0**, com **um usuário e um banco por app**.

| App | Usuário do Atlas | Banco (na URI) | Permissão |
|---|---|---|---|
| my-money-app | `mymoney-app` | `mymoney` | `readWrite` só em `mymoney` |
| aircnc | `aircnc-app` | `aircnc` | `readWrite` só em `aircnc` |
| alô, uai | `alo-uai-app` | `alo_uai` | `readWrite` só em `alo_uai` |

- Uma senha vazada passa a afetar só um app.
- **Network Access**: `0.0.0.0/0`. O Render Free não tem IP fixo; a proteção fica na senha forte de cada usuário.
- A URI leva o nome do banco antes do `?`: `mongodb+srv://alo-uai-app:SENHA@SEU-CLUSTER.xxxxx.mongodb.net/alo_uai?retryWrites=true&w=majority`
- Use senha só com letras e números (**Autogenerate Secure Password**). `@`, `:` e `/` quebram a URI se não forem codificados.
- **Dados antigos: comece do zero (recomendado).** Os posts antigos usam nomes de pessoas reais e imagens da identidade anterior. Com o banco novo `alo_uai`, o feed estreia vazio e com a marca nova.

### O que foi ajustado para produção

| Mudança | Arquivo | Por quê |
|---|---|---|
| `NODE_VERSION` `"22"` nos dois serviços | `render.yaml` | O Node 20 saiu de suporte em abril de 2026; o Vite 8 também pede Node recente no build |
| `autoDeployTrigger: commit` nos dois serviços | `render.yaml` | Cada `git push` na `master` publica sozinho |
| `CORS_ORIGINS` = `https://alo-uai-web.onrender.com` e `PUBLIC_URL` = `https://alo-uai-api.onrender.com` fixados | `render.yaml` | CORS da API e do Socket.IO já liberam o web; as URLs das imagens saem com o endereço público |
| `VITE_API_URL` = `https://alo-uai-api.onrender.com` fixado | `render.yaml` | O web já nasce apontando para a API (HTTP e Socket.IO) |
| Rewrite `/*` → `/index.html` (já existia) | `render.yaml` | F5 em `/new` não dá 404 |
| CI no Node 22 | `ci/github-actions-ci.yml` | Mesma versão do Render |
| Seção "Em produção" e hospedagem atual no lugar do Zeit Now | `Readme.md` | URL e link para este guia |
| Nova identidade **alô, uai**: símbolo, favicon, ícones, paleta, avatar com iniciais, hashtags em chips, tempo relativo | `frontend/src/**`, `frontend/index.html`, `frontend/public/favicon.svg` | Tira a marca de terceiros e mostra habilidade de UI |
| Aviso de demonstração pública (rodapé e formulário) e aviso de "servidor acordando" no carregamento | `frontend/src/App.jsx`, `frontend/src/pages/*` | Demo segura e expectativa certa no plano gratuito |
| Serviços `alo-uai-api` e `alo-uai-web`; banco padrão `alo_uai` | `render.yaml`, `backend/src/config.js`, `backend/.env.example`, `package.json` | Nome novo em toda a infraestrutura |
| Cabeçalho do app mobile com a marca em texto | `instarocket/src/routes.js`, `instarocket/app.json` | App congelado, mas sem o logo antigo |

### Limitações conhecidas do plano gratuito

- **Imagens em disco temporário**: o Render Free apaga o disco a cada deploy e a cada vez que a API dorme e acorda. As fotos publicadas no ar somem (o post continua no banco, com a imagem quebrada). As imagens versionadas em `backend/uploads/resized/` continuam sendo servidas, porque vêm junto com o código. Guardar as imagens num serviço externo gratuito (Cloudinary) é uma decisão sua, não implementada.
- A API dorme após 15 min sem acesso e leva cerca de 1 min para acordar; o feed pode mostrar erro na primeira visita do dia.
- As 750 horas gratuitas por mês são da conta inteira do Render (o site estático não consome essas horas).
- Atlas M0: 512 MB, compartilhados entre os bancos do cluster.

### Segurança e LGPD

- Tipo da imagem validado pelo conteúdo, até 5 MB, nome aleatório, limite de publicações e curtidas por IP, `helmet` e CORS restrito.
- **Publicar não exige login** (só limite por IP): qualquer visitante pode enviar uma foto que fica pública. O rodapé e o formulário avisam para não enviar fotos de pessoas nem dados pessoais (LGPD). Exigir login continua como decisão sua; até lá, acompanhe o feed e apague no Atlas o que não deveria estar lá.
- Nunca versione `backend/.env` (o `.gitignore` já o exclui).

## 3. Solução (passo a passo)

### Etapa 0 · Segredos (urgente)

1. No **MongoDB Atlas → Database Access**, **apague o usuário `dbFeedInstagram`**. A senha dele está no histórico público do Git; apagar o usuário é o que a invalida.

### Etapa 1 · Atlas e validação local (Git Bash)

1. No Atlas, use (ou crie) o cluster **M0** do lote. **Database Access → Add New Database User**: usuário `alo-uai-app`, senha gerada, **Specific Privileges** → `readWrite` no banco `alo_uai`.
2. **Network Access → Add IP Address → Allow Access from Anywhere** (`0.0.0.0/0`), se ainda não existir.
3. **Database → Connect → Drivers**: copiar a URI e acrescentar `/alo_uai` antes do `?`.
4. `cd /c/ambiente-projeto/ser-mvp/instagram-feed`
5. Remover os arquivos substituídos no ciclo MVP:
   ```bash
   git rm backend/src/index.js backend/src/routes.js backend/src/config/upload.js
   git rm -r backend/src/controllers
   git rm frontend/public/index.html frontend/src/index.js frontend/src/App.js frontend/src/routes.js frontend/src/services/api.js
   git rm frontend/src/components/Header.js frontend/src/pages/Feed.js frontend/src/pages/New.js
   ```
6. Remover a identidade antiga (logo, favicon, ícones, imagens sem uso, screenshots e o logo do app):
   ```bash
   git rm frontend/public/logo.svg frontend/public/favicon.ico frontend/public/your-logo-32-ico.png
   git rm frontend/src/assets/camera.svg frontend/src/assets/collect.svg frontend/src/assets/comment.svg frontend/src/assets/like.svg frontend/src/assets/more.svg frontend/src/assets/send.svg
   git rm frontend/src/assets/img-movile-startup.jpeg frontend/src/assets/img-rocketseat.png frontend/src/assets/img-semana-omnistack-7.jpg backend/src/assets/rocketseat-image.png
   git rm .github/tela-aplicacao-1.jpg .github/tela-aplicacao-2.jpg .github/tela-aplicacao-3.jpg .github/preview.gif
   git rm instarocket/src/assets/instagram.png instarocket/src/assets/instagram@2x.png instarocket/src/assets/instagram@3x.png
   ```
7. Tirar do Git as imagens antigas enviadas por usuários (o banco novo começa vazio):
   `git rm -r --cached backend/uploads && echo "uploads/" >> backend/.gitignore`
8. Opcional (app mobile, congelado): o nome que aparece embaixo do ícone no Android fica em `instarocket/android/app/src/main/res/values/strings.xml` (`app_name`). Troque para `alô, uai` se for gerar o APK.
9. `cd backend && cp .env.example .env` e preencher `MONGODB_URI` (passo 3).
10. `npm ci && npm test` (esperado: 5 testes passando).
11. `npm run dev` e abrir `http://localhost:3333/health` (esperado: `{"status":"ok"}`). Encerrar com Ctrl+C.
12. `cd ../frontend && npm ci && npm test && npm run build` (esperado: 6 testes passando e a pasta `build/` criada).

### Etapa 2 · Renomear o repositório e subir para o GitHub (branch `master`)

1. No GitHub, **Settings → General → Repository name**: trocar `instagram-feed` por `alo-uai` e salvar. O GitHub redireciona o endereço antigo, mas atualize o remoto local:
   `git remote set-url origin https://github.com/douglasabnovato/alo-uai.git`
2. Opcional: renomear a pasta local de `instagram-feed` para `alo-uai` (feche o editor antes). Os comandos abaixo usam o nome atual.
3. `cd /c/ambiente-projeto/ser-mvp/instagram-feed`
4. Ativar o CI: `mkdir -p .github/workflows && mv ci/github-actions-ci.yml .github/workflows/ci.yml && rmdir ci`
5. `git status` (não podem aparecer `.env`, `node_modules/` nem `build/`)
6. `git add -A`
7. `git commit -m "feat: identidade própria alô, uai, blueprint do Render e guia de deploy"`
8. `git push origin master`
9. No GitHub, aba **Actions**: os jobs `backend` e `frontend` precisam ficar verdes.

### Etapa 3 · Criar os serviços no Render

1. Entrar em **render.com** com a conta do GitHub e autorizar o repositório `alo-uai`.
2. **New → Blueprint** e escolher `douglasabnovato/alo-uai`, branch `master`.
3. O Render lista `alo-uai-api` (Free) e `alo-uai-web` (Static). Ele pede um único valor: **`MONGODB_URI`** → colar a URI da Etapa 1.
4. **Apply**. Acompanhar os **Logs** da API até aparecer `API em http://localhost:10000` (3 a 5 min).
5. Se o Render usar outro endereço porque o nome já existe, corrija `CORS_ORIGINS` e `PUBLIC_URL` (na API) e `VITE_API_URL` (no web) em **Environment**, e depois **Manual Deploy** no web.

### Etapa 4 · Conferir no ar

1. `https://alo-uai-api.onrender.com/health` responde `{"status":"ok"}`.
2. `https://alo-uai-web.onrender.com` abre o feed com a marca alô, uai, o rodapé de demonstração e a mensagem "Tá quietim por aqui".
3. Em **/new**, publicar uma foto: ela aparece no topo do feed, com no máximo 500 px de largura.
4. Abrir o feed em duas abas e curtir numa delas: o número muda na outra sem recarregar (Socket.IO).
5. F5 em `/new`: a página continua abrindo (rewrite funcionando).
6. No DevTools (aba Network), as chamadas, as imagens e o WebSocket vão para `alo-uai-api.onrender.com` sem erro de CORS.

### Etapa 5 · Fechar

1. Se as URLs reais forem diferentes das previstas, corrigir no `Readme.md`, commit e push.
2. No GitHub, **About → Website**: colar `https://alo-uai-web.onrender.com`. Em **Description**: "alô, uai · feed de fotos com prosa mineira (React, Express, MongoDB, Socket.IO)".
