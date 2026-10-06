# MELHORIAS — codespaces-react

> **Gerado por análise de código em 2026-10-05** · Stack: Vite + React 18 (template GitHub Codespaces) · test runner: vitest
> Branch `main` · sem dependências CRA (react-scripts ausente) · devcontainer presente · sem CI
>
> **Este arquivo é um plano de execução.** Cada item tem ID, `arquivo:linha`, mudança exata, critério de aceite e comando de verificação.

---

## 0. Como usar este documento

1. Execute na ordem **P0 → P1 → P2 → P3**, respeitando as ondas da §8.
2. Ao terminar um item: marque `- [x]`, rode o **Verificação**, comite `fix(<ID>): descrição`.
3. Este template é **Vite**, não CRA — não reintroduzir padrões `react-scripts`.
4. **Idioma:** português.

---

## 1. Diagnóstico executivo

Template Vite+React para Codespaces: `start: vite`, `build: vite build`, `test: vitest`. `overrides` de segurança presentes, devcontainer documentado.

**O que está bem (não regredir):**

| Item | Evidência |
|---|---|
| `overrides` mitigando advisories (@svgr/webpack, @adobe/css-tools, postcss) | `package.json` |
| Stack Vite moderna (sem CRA) | `package.json` scripts |
| vitest + setupTests presentes | `src/App.test.jsx`, `src/setupTests.js` |
| devcontainer + launch.json | `.devcontainer/devcontainer.json`, `.vscode/launch.json` |
| build multi-stage com serve | `Dockerfile` |

**O que está quebrado:**

1. `eslintConfig` ainda aponta `react-app`/`react-app/jest` — extensão CRA que **não está instalada** (herança morta do template).
2. `RUN npm ci || npm install` mascara falha do `npm ci` (padrão repetido do acervo).
3. Sem CI — vitest só roda se alguém lembrar.

---

## 2. Tabela de prioridades

| ID | Título | Sev | Arquivo | Depende de |
|---|---|---|---|---|
| DEVOPS-01 | `npm ci || npm install` mascara falha de lockfile | **P1** | `Dockerfile` | — |
| DOC-01 | eslintConfig `react-app` órfão (CRA não instalado) | **P2** | `package.json` | — |
| TEST-01 | CI ausente — vitest não roda automaticamente | **P2** | *(ausente)* `.github/workflows/` | — |
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

- **Arquivo:** *(ausente)* `.github/workflows/`
- **Evidência:** `package.json` tem `"test": "vitest"`, `src/App.test.jsx` existe, mas nenhum workflow executa.
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
- **Mudança:** remover o fallback: `RUN npm ci`. Se o lock faltar, **falhar** (é o sinal correto).
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
2. **`DOC-01`** — eslint de verdade.
3. **`TEST-01`** — CI com vitest.
4. **`DOC-02`** — README.

### Wave 3 — Limpeza (P3)
5. **`IMP-01`** — herança CRA.

**Dependências:** `TEST-01` depois de `DOC-01` (CI deve rodar o lint novo também).

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
- [ ] `DEVOPS-01` — sem `|| npm install` no Dockerfile

**Qualidade/doc**
- [ ] `DOC-01` — `npm run lint` roda
- [ ] `TEST-01` — CI com `vitest run`
- [ ] `DOC-02` — README == comandos reais
- [ ] `IMP-01` — herança CRA removida ou justificada

**Validação final:**
```bash
npm ci && npm run build && npx vitest run
npm run lint
```

---

*Fim do plano. Gerado por leitura direta do código em 2026-10-05. Nenhum item já estava corrigido — todos apontam para defeitos ainda presentes.*
