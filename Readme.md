# Semana Omnistack 7.0

## Atualização: 31 de dezembro de 2019 - 18:52
## Criação: 12 de junho de 2019
## Prática : @douglasabnovato

## Ferramentas : 

![Rocketseat](/images/logo-rocketseat.png)
![ReactJS](/images/logo-reactjs.jpg)
![React Native](/images/logo-react-native.png)
![Git](/images/logo-git.png)
![Github](/images/logo-github.png)
![HTML/CSS/Javascript](/images/logo-html-css-js.jpeg)
![VSCode](/images/logo-VSCode.png)
![Yarn](/images/logo-yarn.png)
![Nodejs](/images/logo-nodejs.png)

### Projeto
> Construir uma aplicação do zero utilizando NodeJS no back-end, ReactJS no front-end e React Native no mobile.
>Projeto será um **Clone do Feed do instagram**, com módulo web e mobile, sendo real time.
### Ambiente de desenvolvimento
#### Vídeo #1 - 10/06/2019

**Ferramentas**
- Node JS : `https://nodejs.org/en/` : versão LTS
- package manager : chocolatey é para o ambiente windows
- Yarn : `https://yarnpkg.com/`
- Node JS : `node -v`; npm : `npm -v`; yarn : `yarn -v`
- Editor : VSCode, plugin 

**Extensões**
- tema `dracula`
- `rocketseat react native`
- `rocketseat reactjs`
- `Material icon theme`
- fonte `fira code`

### Criando a base da aplicação - BACKEND
#### Vídeo #2 - 11/06/2019
- Empresas que estão utilizando essa tecnologia React, React Native, Nodejs: NetFlix, Trello, PayPal, Linkedin, Uber, NASA, Medium
- backend da aplicação utilizando nodejs
- api rest: serviços que não possuem funcionalidades de view
- nova pasta : backend >> `yarn init -y` : cria arquivo `package.json`
- instalar dependência express : `yarn add express`
- `node src/index.js` >> `http://localhost:3333/`
- nodemon : `yarn add nodemon -D`
- `yarn dev` : atualiza o servidor a cada mudança
- Mongo DB Atlas : mongo online : `https://www.mongodb.com/cloud/atlas`
1. cluster com várias bases de dados
- mongoose : `yarn add mongoose`
- arquivo `routes.js`
- Post.js, PostController.js
- criar pastas : src : models, controllers, config
- Insomnia : `New Request >> POST >> Json`
- Multer : `yarn add multer`
1. `console.log(req.body);`
2. `console.log(req.file);`
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

### Construindo a interface web - FRONTEND
#### Vídeo #3 - 12/06/2019 
- na pasta do projeto backend da aplicação `yarn dev`
- criando  projeto : 
- `npx create-react-app frontend`
- `cd frontend`
- `yarn start`

### Desenvolvendo o app mobile 
#### Vídeo #4 - 13/06/2019

### Funcionalidades avançadas 
#### Vídeo #5 - 14/06/2019 

### Tirando todas as dúvidas 
#### Vídeo #6 - 16/06/2019 

:. De `Semana Omnistack 7.0 - Rocketseat`.<br/> 
Por Diego Fernandes : https://rocketseat.com.br