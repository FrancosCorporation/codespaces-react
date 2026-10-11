# MELHORIAS — codespaces-react

> **Gerado por análise de código em 2026-10-05** · Stack: Vite + React 18 (template GitHub Codespaces) · test runner: vitest
> Branch `main` · Vite/React · devcontainer presente · CI com lint/build/audit
>
> **Este arquivo é um plano de execução.** Cada item tem ID, `arquivo:linha`, mudança exata, critério de aceite e comando de verificação.

## Registro de implementação — 2026-10-11

- Docker agora exige `npm ci`, usa Node 24 e executa a imagem final como usuário sem privilégios; Compose publica a prévia apenas em loopback.
- Trocada a configuração órfã do CRA por ESLint flat config e adicionados lint/CI de build. Removido o helper `reportWebVitals` e a dependência que não coletava métricas.
- README e inicialização do Vite apontam para a porta encaminhada pelo Codespaces; a tela inicial agora tem um contador funcional, navegação por teclado e links para os guias.
- `TEST-01` continua pendente: a CI não executa Vitest nesta rodada. A suíte existente não foi alterada nem executada.
- CI `7b1411ebdf333f6bc0dcb58b5bff4756ff82f864` publicado em `main`; execução remota concluída com sucesso.

---

## 0. Como usar este documento

1. Execute na ordem **P0 → P1 → P2 → P3**, respeitando as ondas da §8.
2. Ao terminar um item: marque `- [x]`, rode o **Verificação**, comite `fix(<ID>): descrição`.
3. Este template é **Vite**, não CRA — não reintroduzir padrões `react-scripts`.
4. **Idioma:** português.

---

## 1. Diagnóstico executivo

Template Vite+React para Codespaces: `dev/start: vite`, `build: vite build`, `test: vitest`. `overrides` de segurança presentes, devcontainer e CI de lint/build configurados; Vitest ainda não faz parte da CI.

**O que está bem (não regredir):**

| Item | Evidência |
|---|---|
| `overrides` mitigando advisories (@svgr/webpack, @adobe/css-tools, postcss) | `package.json` |
| Stack Vite moderna (sem CRA) | `package.json` scripts |
| vitest + setupTests presentes | `src/App.test.jsx`, `src/setupTests.js` |
| devcontainer + launch.json | `.devcontainer/devcontainer.json`, `.vscode/launch.json` |
| build multi-stage com serve | `Dockerfile` |

**Problemas encontrados na análise inicial:**

1. `eslintConfig` apontava para presets CRA ausentes, e o projeto não tinha um comando de lint funcional.
2. `RUN npm ci || npm install` mascarava falha do lockfile.
3. O guia Docker mandava usar Compose, mas não havia arquivo Compose; Vite encaminhava porta diferente da configurada no Codespaces.
4. A tela do template não tinha o contador descrito no README original.

---

## 2. Tabela de prioridades

| ID | Título | Sev | Arquivo | Depende de |
|---|---|---|---|---|
| DEVOPS-01 | `npm ci || npm install` mascara falha de lockfile | **P1** | `Dockerfile` | — |
| DOC-01 | eslintConfig `react-app` órfão (CRA não instalado) | **P2** | `package.json` | — |
| TEST-01 | CI não executa Vitest automaticamente | **P2** | `.github/workflows/ci.yml` | — |
| DOC-02 | README — verificar instruções vs Vite real | **P2** | `README.md` | — |
| IMP-01 | web-vitals/reportWebVitals herança CRA | **P3** | `src/reportWebVitals.js` | — |

---

## 3. Segurança

*(Sem itens SEC — template local, sem credenciais nem rede. `overrides` já aplicado.)*

---

## 4. Bugs e defeitos funcionais

*(Nenhum item de bug funcional confirmado — app de demonstração.)*

---

## 5. Qualidade: testes

### TEST-01 · vitest sem CI — testes não rodam automaticamente · [P2]

- **Arquivo:** `.github/workflows/ci.yml`
- **Evidência:** `package.json` tem `"test": "vitest"` e `src/App.test.jsx` existe; o workflow cobre instalação, audit, lint e build, mas não executa Vitest.
- **Estado:** a CI agora roda instalação limpa, lint e build; Vitest segue pendente.
- **Impacto:** regressões passam; o script de teste vira decoração (padrão recorrente do acervo).
- **Mudança:** workflow `on: [push, pull_request]`: `npm ci` → `npm run build` → `npx vitest run`.
- **Aceite:** PR que quebra o teste é bloqueado.
- **Verificação:**
  ```bash
  npx vitest run 2>&1 | tail -3 && ls .github/workflows/
  ```

---

## 6. DevOps / Infra

### DEVOPS-01 · `npm ci || npm install` mascara falha do lockfile · [P1]

- **Arquivo:** `Dockerfile` (etapa build)
- **Evidência:** `RUN npm ci || npm install` — se `package-lock.json` estiver dessincronizado, o `npm ci` falha e o `npm install` **silenciosamente instala outra árvore** (a que o lock dizia para não usar).
- **Impacto:** builds "verdes" com dependências diferentes das testadas; lockfile perde a função.
- **Mudança:** remover o fallback: `RUN npm ci`.
- **Aceite:** build falha quando lock está errado; build passa quando está certo.
- **Verificação:**
  ```bash
  grep -n 'npm install' Dockerfile || echo OK
  ```

### IMP-01 · web-vitals/reportWebVitals — herança CRA · [P3]

- **Arquivo:** `src/reportWebVitals.js`
- **Evidência:** helper padrão do CRA; Vite não usa `reportWebVitals` no bootstrap — conferir se `src/index.jsx` referencia; se sim, `web-vitals` vira dependência real; se não, é lixo.
- **Impacto:** código morto confunde.
- **Mudança:** remover arquivo + dep `web-vitals` se não referenciado; senão, manter e documentar.
- **Aceite:** sem arquivo órfão.
- **Verificação:**
  ```bash
  grep -rn 'reportWebVitals' src/ | head
  ```

---

## 7. Documentação

### DOC-01 · eslintConfig `react-app` órfão · [P2]

- **Arquivo:** `package.json`
- **Evidência:** `"extends": ["react-app", "react-app/jest"]` — extensões do `eslint-config-react-app`, que **não** está nas deps (só react-scripts traz); scripts não têm `lint`.
- **Impacto:** `eslint` não tem config válida — lint quebra ou é ignorado; falsa sensação de lint ativo.
- **Mudança:** substituir por flat config do ESLint 9 (`eslint.config.js` com `@eslint/js` + `react-hooks`) e adicionar `"lint": "eslint ."`.
- **Aceite:** `npm run lint` roda e passa.
- **Verificação:**
  ```bash
  npm run lint 2>&1 | tail -3
  ```

### DOC-02 · README — conferir comandos vs Vite · [P2]

- **Arquivo:** `README.md`
- **Evidência:** (ler antes de executar; se mencionar `react-scripts` ou `npm start` incompatível com `vite`, é divergência — se estiver correto, item JÁ RESOLVIDO).
- **Impacto:** instruções erradas travam quem clona.
- **Mudança:** seção "Desenvolver" com `npm ci && npm run dev` + "Testar" `npx vitest run`.
- **Aceite:** terceiro sobe o app seguindo o README.
- **Verificação:**
  ```bash
  grep -n 'vite\|react-scripts' README.md
  ```

---

## 8. Ordem de execução (waves)

### Wave 1 — Infra (P1)
1. **`DEVOPS-01`** — `npm ci` puro.

### Wave 2 — Qualidade (P2)
2. **`DOC-01`** — ESLint funcional (concluído).
3. **`DOC-02`** — README alinhado ao Vite (concluído).
4. **`TEST-01`** — incluir Vitest na CI (pendente).

### Wave 3 — Limpeza (P3)
5. **`IMP-01`** — herança CRA.

**Estado atual:** DEVOPS-01, DOC-01, DOC-02 e IMP-01 concluídos. TEST-01 depende da suíte Vitest existente e ainda não foi implementado na CI.

---

## 9. Fora de escopo / riscos

| Item | Decisão | Motivo |
|---|---|---|
| Migrar de volta para CRA | **Nunca** | Vite é a escolha atual; eslintConfig CRA é resto, não direção. |
| Adicionar framework (Next etc.) | **Não** | Template didático. |
| Remover devcontainer | **Não** | É a razão do repo (Codespaces). |

**Riscos:** baixos — app estático de exemplo.

---

## 10. Definição de pronto (DoD)

**Infra**
- [x] `DEVOPS-01` — sem `|| npm install` no Dockerfile

**Qualidade/doc**
- [x] `DOC-01` — `npm run lint` roda
- [ ] `TEST-01` — CI com `vitest run`
- [x] `DOC-02` — README == comandos reais, incluindo Compose e porta 3000
- [x] `IMP-01` — helper e dependência CRA removidos

**Validação final:**
```bash
npm ci && npm run build && npx vitest run
npm run lint
```

**Validação realizada em 2026-10-11:** `npm ci`, `npm audit --audit-level=high` (0), `npm run lint`, `npm run build`, `docker compose config --quiet`, Docker build e `git diff --check` passaram. Vitest não foi executado.

---

*Fim do plano. O diagnóstico inicial foi feito em 2026-10-05; o registro de implementação reflete o estado em 2026-10-11.*
