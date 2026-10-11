# Codespaces React

Um ponto de partida pequeno para aprender React e experimentar dentro do GitHub Codespaces. O projeto usa React 18 e Vite; a tela inicial inclui um contador interativo para demonstrar estado e eventos.

## Rodar no GitHub Codespaces

Abra o repositório no Codespaces. O Dev Container instala as dependências e encaminha a aplicação pela porta 3000.

## Rodar localmente

Requisitos: Node.js 22.13+ ou 24+ e npm. Node 24 é usado no Docker, no Codespaces e na CI.

```bash
npm ci
npm run dev
```

Abra http://localhost:3000. O servidor também pode ser iniciado com `npm start`.

## Prévia com Docker

O Compose constrói a versão de produção e a serve localmente na porta 3000:

```bash
docker compose up --build
```

Abra http://localhost:3000. Para usar outra porta local, defina `APP_PORT`, por exemplo `APP_PORT=8080 docker compose up --build`.

## Comandos

```bash
npm run dev       # servidor de desenvolvimento do Vite
npm run build     # bundle de produção em dist/
npm run preview   # prévia local do bundle
npm run lint      # análise estática com ESLint
npx vitest run    # executar a suíte existente uma vez
```

O workflow de CI executa instalação limpa, lint e build. Os testes existentes são executados separadamente com `npx vitest run`.

## Estrutura

```text
.devcontainer/   configuração do Codespaces
public/          ícones e imagens
src/             interface React e configuração Vitest
compose.yaml     prévia local da versão de produção
```

## Licença

MIT (do template original do GitHub). Consulte [LICENSE](LICENSE).
