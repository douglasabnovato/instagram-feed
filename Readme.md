<h3 align="center">
  Instagram Feed 🚀
</h3>

---
<br>

![Resultado da Aplicação](/images/a-aplicacao-terminada.jpg)

### O que é a aplicação

- A aplicação é o feed do Instagram com um frontend web, um frontend mobile e um backend.

#### Tecnologias/ Ferramentas/ Bibliotecas

- HTML / Javascript / CSS
- ReactJS / NodeJS / React Native

#### Código + Dependências

- git clone "http": ter o projeto na máquina local
- npm install 
- Rodar a aplicação: `npm start`

#### Passo a passo do projeto

#### Ambiente de desenvolvimento

- [x] 1.1. NodeJS - `https://nodejs.org/en/` : versão LTS: v12.18.3 - `node -v`;
- [x] 1.2. package manager - Chocolatey é para o ambiente windows
- [x] 1.3. gerenciador de pacotes 
- [x] 1.3.1. npm : `npm -v`
- [x] 1.3.2. Yarn : `https://yarnpkg.com/` : versão LTS: v1.21.1 - `yarn -v`
- [x] 1.4. Editor : VSCode 
- [x] 1.5. Extensões e Plugins
- [x] 1.5.1. Tema: `dracula`
- [x] 1.5.2. `rocketseat react native`
- [x] 1.5.3. `rocketseat reactjs`
- [x] 1.5.4. `Material icon theme`
- [x] 1.5.5. fonte `fira code`
- [x] 1.6. Sketch cloud - desenhar a aplicação : Instagram Feed

#### Criando a base da aplicação - BACKEND 

- [x] 2.1. Empresas que estão utilizando essa tecnologia React, React Native, Nodejs: NetFlix, Trello, PayPal, Linkedin, Uber, NASA, Medium
- [x] 2.2. backend da aplicação utilizando nodejs
- [x] 2.3. api rest: serviços que não possuem funcionalidades de view
- [x] 2.4. nova pasta : backend - `yarn init -y` : cria arquivo `package.json` : guarda os registros das dependências do nosso projeto
- [x] 2.5. instalar dependência Express : `yarn add express`
- [x] 2.5.1. `yarn.lock`: arquivo de logs
- [x] 2.5.2. `node src/index.js` >> `http://localhost:3333/` : PORTA DO backend
- [x] 2.5.3. Nodemon : `yarn add nodemon -D` - script dev no package.json - `yarn dev` : atualiza o servidor a cada mudança
- [x] 2.6.1. Mongo DB Atlas : mongo online : `https://www.mongodb.com/cloud/atlas`
- [x] 2.6.2. criar um cluster para depois criar nossa base de dados
- [x] 2.6.3. banco de dados não relacional
- [x] 2.7. mongoose : `yarn add mongoose`
- [x] 2.8. arquivo `routes.js`
- [x] 2.9. Post.js, PostController.js
- [x] 2.9.1. criar pastas : src : models, controllers, config
- [x] 2.10. Insomnia : `New Request >> POST >> Json`
- [x] 2.11. Multer : `yarn add multer`
- [x] 2.11.1. `console.log(req.body);`
- [x] 2.11.2. `console.log(req.file);`
- path : formata caminho de arquivos
- upload de imagens no diretório do projeto 
- upload de imagem na base de dados
- listando os posts na api rest
- dar like : `http://localhost:3333/posts/5d03fa4f261c3d2928c817bb/like`
- redimensionar imagens: dimensões menores, qualidade menores.
- instalar sharp: manipular imagens dentro da aplicação.
- insomnia - post >> create >> `http://localhost:3333/posts`
- deletar a imagem original : `fs.unlinkSync`
- path : endereço da imagem : `http://localhost:3333/files/OmniStack.png`
- transformando png em jpg
- `http://localhost:3333/files/OmniStack.jpg`
- cors : `yarn add cors` : permitir acessibilidade mesmo em domínios diferentes
- real time : biblioteca **socket.io**  : `yarn add socket.io`
- `socket.io` : server = http e io demais : possibilitam acessar a aplicação de diferentes protocolos, ou seja, que nosso backend seja visualizado pelo frontend.
- Revisão:
1. `index.js`:entrada da nossa aplicação- importação das dependências, conexão com banco de dados, divisão do servidor para http e socket.io, o cors permitindo acesso por todos protocolos, rotas para arquivos físicos e estáticos
2. `routes.js`: rotas get e post, rotas para realizar likes
3. controllers: LikeController e PostController fazendo nossa regra de negócios.
4. Model Post: uma representação da tabela no banco de dados.
5. config `upload.js` : determinado o local para armazenar os arquvios de upload
6. libs express mongo multer sharp 
- finalizamos o BACKEND da aplicação.
:. próximo passo é construir o FRONTEND para consumir essa api. 

#### Construindo a interface web - FRONTEND

- na pasta do projeto backend da aplicação `yarn dev`
- backend : `http://localhost:3333/`
- criando  projeto : 
- `npx create-react-app frontend`
- `cd frontend`
- `yarn start`
- frontend : `http://localhost:3000/`
- Adicionar rotas: `yarn add react-router-dom` 
- Biblioteca axios: `yarn add axios`, para tratar requisições
- alguns destaques durante essa etapa do projeto:
1. componentes em formato de função
2. componentes em formato de classe
3. navegação organizado em rotas no arquivo `routes.js`. Router verifica se a rota citada está no endereço e a exibe. Podendo assim, encontrar mais de uma rota. Para isso não acontecer, utiliza-se o Switch, para garantir que apenas um endereço será exibido por rota.
4. Link é o componente react que funciona como o `<a>` do html, para fazer linkes
5. axios : a biblioteca responsável por tratar requisição http<br/>
**ERRO**: a api que criamos não está retornando as imagens
- tratando o formulário de um novo posto em `New.js`
- like
- real time : socket.io : `yarn add socket.io-client`

#### Desenvolvendo o app mobile 

- Para configurarmos o ambiente de desenvolvimento, seguir orientações conforme detalhes no link `https://docs.rocketseat.dev/ambiente-react-native/android/windows` 
- Chocolatey
- Node, Python2 e a JDK8
- CLI (Command Line Interface) do React Native
- SDK do android
- genymotion + virtualbox
- criar o projeto mobile : `react-native init instarocket`
- rodar a aplicação com o emulador aberto : `react-native run-android`
- nas próximas vezes : `react-native start`

#### Funcionalidades avançadas  

#### Tirando todas as dúvidas   

#### Próximo passo na aplicação

- Link para o artigo da aplicação 

#### Anotações   

- Fonte do projeto: [Rocketseat - Omnistack 7.0 - Diego Fernandes](https://rocketseat.com.br)

---
<br>

.: Por [Douglas A B Novato](https://linktr.ee/douglasabnovato)