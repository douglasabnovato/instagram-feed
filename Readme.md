# Semana Omnistack 7.0

## Atualização: 20 de dezembro de 2019 - 12:01
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

Projeto será um **Clone do Feed do instagram**
- web
- mobile
- real time

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
- redimensionar imagens
- instalar sharp
- insomnia - post >> create >> `http://localhost:3333/posts`
- deletar a imagem original : `fs.unlinkSync`
- path : endereço da imagem : `http://localhost:3333/files/OmniStack.png`
- transformando png em jpg
- `http://localhost:3333/files/OmniStack.jpg`
- cors : `yarn add cors` : permitir acessibilidade mesmo em domínios diferentes
- real time : biblioteca **socket.io**  : `yarn add socket.io`
- server = http e io demais : possibilitam acessar a aplicação de diferentes protocolos.
- revisado o projeto, funcionando corretamente. Partindo para a próxima etapa.

### Construindo a interface web - FRONTEND
#### Vídeo #3 - 12/06/2019 
- `create-react-app frontend`

### Desenvolvendo o app mobile 
#### Vídeo #4 - 13/06/2019

### Funcionalidades avançadas 
#### Vídeo #5 - 14/06/2019 

### Tirando todas as dúvidas 
#### Vídeo #6 - 16/06/2019 

:. De `Semana Omnistack 7.0`.<br/> 
Por Diego Fernandes : https://rocketseat.com.br