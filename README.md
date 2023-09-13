# swagger-api
<!--
<div align="center">
<img src="https://miro.medium.com/v2/resize:fit:200/format:webp/0*otsfLuH8efGUeedm.png"/>
</div>
-->
![](https://sloc.xyz/github/Alessandro1918/swagger-api/)
![](https://sloc.xyz/github/Alessandro1918/swagger-api?category=code)
![](https://sloc.xyz/github/Alessandro1918/swagger-api?category=comments)

## 🚀 Projeto
Um exemplo de documentação de rotas de API com Swagger. Especificação de endpoints, parâmetros, retorno, tudo facilmente documentável e consultável em uma página web disponível em uma rota da própria API.

<div align="center">
    <img src="assets/routes.png" alt="routes" title="routes" width="75%"/>
</div>
<div align="center">
    <img src="assets/api-auth.png" alt="api-auth" title="api-auth" width="30%"/>
    <img src="assets/api-put.png" alt="api-put" title="api-put" width="30%"/>
    <img src="assets/api-delete.png" alt="api-delete" title="api-delete" width="30%"/>
</div>

## 🛠️ Tecnologias
- [Swagger](https://swagger.io)
- [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc)
- [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)

## 🧊 Cool features:
- Login fornece um token JWT para uso nas rotas autenticadas;
- Limite de acessos por período (Ex.: 60 requests por minuto);

## 🗂️ Utilização

### 🐑🐑 Clonando o repositório:

```bash
  $ git clone url-do-projeto.git
```

### ▶️ Rodando o App:

```bash
  $ cd swagger-api      #change to that directory 
  $ npm install         #download dependencies to node_modules
  $ npm run dev         #start the project
```

Consultar a documentação em: [localhost:4000/api-docs](http://localhost:4000/api-docs)
