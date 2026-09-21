# codespaces-react

## 🐳 Instalação e Execução (Docker) — recomendado

### Pré-requisitos
- [Docker](https://docs.docker.com/get-docker/) + Docker Compose

### Rodar com Docker
```bash
docker compose up --build
```


### Sem Docker (local)
```bash
npm install
npm start
```


Template oficial de **React + Vite** do GitHub Codespaces, usado como base de
estudo e ponto de partida para experimentos com React.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Codespaces](https://img.shields.io/badge/GitHub-Codespaces-181717?style=flat-square&logo=github)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Status](https://img.shields.io/badge/status-template-lightgrey?style=flat-square)

## Sobre

Repositório criado a partir do template **GitHub Codespaces React** para
explorar o ambiente de desenvolvimento na nuvem do GitHub. Contém o app
inicial do template (contador de cliques) e a configuração de devcontainer
pronta para uso.

## Funcionalidades

Comprovadas pelo código:

- App inicial do template (`src/App.jsx`) com o "Octocat" e o contador.
- **Dev Container** pré-configurado (`.devcontainer/devcontainer.json`) para
  abrir o projeto direto no Codespaces/VS Code.
- Configuração de Vite (`vite.config.js`) e testes com Testing Library
  (`src/App.test.jsx`).

## Como rodar

```bash
npm install
npm start      # servidor de desenvolvimento (Vite)
npm test       # testes
npm run build  # build de produção
```

## Estrutura do projeto

```
.devcontainer/   # configuração do Codespaces
.vscode/         # launch/tasks
public/          # assets do template
src/             # aplicação React
```

## Licença

MIT (do template original, © GitHub) — veja [LICENSE](LICENSE).
