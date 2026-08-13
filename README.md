# sentinel-qa-internal-app

CRUD mínimo de clientes (HTML/CSS/JS puro + servidor Express), criado como alvo real para uma sessão de testes do **Sentinel** (ambiente `INTERNAL`, clonado via `githubRepo`/`githubBranch`).

## Rodar localmente

```bash
npm install
npm start        # http://localhost:5501
```

## Testes

```bash
npm test         # smoke test HTTP contra as rotas /api/clientes
```

## Seletores (propositalmente mistos, para avaliar o Sentinel Recorder)

| Elemento | Estratégia |
|---|---|
| Input nome / email, botão Adicionar | `data-testid` |
| Checkbox "ativo" | `aria-label` |
| Botão Editar | `id="edit-btn-<id>"` |
| Botão Remover, Salvar/Cancelar (edição) | nenhum atributo — `css-path` |
