## Bot  Volo

Este é um bot para o discord feito com as funcionalidades mais modernas do discord.js para que o usuário tenha uma boa experiência. Para obter esse bot no seu servidor clique [aqui](https://discord.com/api/oauth2/authorize?client_id=1176247232715030538&permissions=8&scope=bot).

## Como funciona

Todas suas funcionalidades são acessadas por meio de comandos, para iniciar um comando use o prefixo "/" após isso o discord já vai sugerir o auto complete dos comandos.

## Comandos

- Busca imagens aleatórias de gatos

- Busca imagens aleatórias de cachorros

## Parte Técnica

Aqui falaremos sobre partes técnicas o que pode ser de interesse para alguns desenvolvedores.

### .env

Nesse projeto é utilizado um arquivo .env com informações sigilosas sobre o bot, as variáveis de ambiente são:

```env
TOKEN=<TOKEN_DO_SEU_BOT>
CLIENT_ID=<ID_DO_SEU_BOT>
```

É importante a criação desse arquivo ou adaptação do código para que o projeto funcione corretamente.

### Dependências 

Este projeto tem alguns dependências, para obte-las você poder usar o seguinte comando caso tenha o npm instalado na sua máquina:

```terminal
npm install
```

Dessa forma você terá todas as dependências do projeto no node_modules. 

### Node

Como esperado de uma aplicação javascript fora dos navegadores, esse projeto usa o Node, então para que tudo ocorra corretamente certifique-se de ter o Node em sua máquina.

### settings.json

Nesse arquivo há algumas variáveis que podem ser modificadas, como a "pallete" que é onde se encontra as cores que o bot usa nos embeds.

### Hospedagem

A aplicação está foi hospedada pelo site render.com. Como o plano é gratuito pode ter a chance do bot ficar offline, para resolver isso é necessário carregar uma página web clicando [aqui](https://volo-bot.onrender.com/) (o carregamento da página pode demorar alguns segundos).
