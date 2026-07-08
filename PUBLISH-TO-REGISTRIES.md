# Publier @vectosolve/mcp dans les registres MCP (le win DR #1)

> **Déjà fait pour toi** (commits prêts dans ce dossier) :
> - `package.json` : version bumpée **1.0.4** + `mcpName` + `repository` ajoutés
> - `server.json` (registre officiel), `glama.json` (Glama), `smithery.yaml` (Smithery) créés
> - `npm run build` lancé → `dist/index.js` à jour
>
> Il ne te reste que les étapes qui ont besoin de **ton auth GitHub/npm** (~30 min). Fais-les dans un vrai terminal (pas le sandbox).

---

## 1. Publier sur npm (5 min) — débloque tout le reste

```bash
cd vectosolve-mcp
npm publish --access public      # publie la 1.0.4 (build déjà fait)
```
> Si npm demande un login : `npm login` d'abord. Le registre officiel vérifie que la 1.0.4 sur npm contient bien `mcpName`, donc cette étape doit passer en premier.

## 2. Registre officiel MCP (10 min) — DR ~80, propage à PulseMCP + Glama

Installe le CLI (PowerShell) :
```powershell
$arch = if ([System.Runtime.InteropServices.RuntimeInformation]::ProcessArchitecture -eq "Arm64") { "arm64" } else { "amd64" }
Invoke-WebRequest -Uri "https://github.com/modelcontextprotocol/registry/releases/latest/download/mcp-publisher_windows_$arch.tar.gz" -OutFile "mcp-publisher.tar.gz"
tar xf mcp-publisher.tar.gz mcp-publisher.exe
Remove-Item mcp-publisher.tar.gz
```
Puis (depuis `vectosolve-mcp/`, où est `server.json`) :
```powershell
.\mcp-publisher.exe login github      # ouvre github.com/login/device, entre le code, autorise (compte org Vectosolve)
.\mcp-publisher.exe publish
# verif :
curl "https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.Vectosolve/mcp"
```

## 3. Pousser le repo sur GitHub (2 min) — requis pour Glama/Smithery

```bash
git add package.json server.json glama.json smithery.yaml dist
git commit -m "feat: list in MCP registries (server.json, glama.json, smithery.yaml) + bump 1.0.4"
git push origin main
```

## 4. Glama.ai (5 min) — DR ~70, dofollow

1. Va sur **https://glama.ai/mcp/servers** → **Add Server** → colle `https://github.com/Vectosolve/vectosolve-mcp` → submit.
2. Si déjà indexé : ouvre la fiche → **Claim ownership** (lit `glama.json`, te lie au repo).
3. Mets la **Description** = le pitch maker + le site `https://vectosolve.com/developers`.

## 5. Smithery.ai (5 min) — DR ~60, dofollow

1. **https://smithery.ai** → **Sign in with GitHub** (org Vectosolve).
2. Cherche `vectosolve` → **Claim server** (ou **Add Server** + connecte le repo).
3. `smithery.yaml` est déjà là → onglet **Deployments** → **Deploy** si tu veux la fiche hébergée.

## 6. PRs awesome-mcp-servers (10 min) — DÉCOUVERTE seulement, PAS un backlink SEO

> ⚠️ CORRECTION (vérifié sur le HTML réel) : GitHub met `rel="nofollow"` sur **tous** les liens externes des README. Donc une PR sur awesome-mcp-servers = **zéro link equity**. À faire pour la visibilité/crédibilité dev, **pas pour le DR**. Ne compte pas ça comme un backlink.

Si tu le fais quand même (découverte), PR sur **punkpeye/awesome-mcp-servers** (pas wong2), catégorie Image/Design, bullet :
```markdown
- [VectoSolve](https://github.com/Vectosolve/vectosolve-mcp) - Image-to-SVG for makers: vectorize, remove background, upscale, and generate SVG logos. Outputs cut-ready vectors for laser, Cricut, CNC and DXF workflows.
```

---

## Pitch maker à réutiliser partout (verbatim)
> Vectorize images to clean SVG, plus remove background, AI upscale, and generate SVG logos, directly from Claude / Cursor. The only image MCP tuned for makers: outputs cut-ready vectors for laser engravers, Cricut, CNC and DXF workflows.

## Résultat attendu (honnête, vérifié)
Le SEUL backlink dofollow VÉRIFIÉ ici, c'est **Glama** (testé : liens sortants sans `rel`, listing auto en quelques minutes). Mets `homepage=vectosolve.com` dans `glama.json` (déjà fait) pour que le lien dofollow pointe sur ton domaine, pas juste le repo. Le registre officiel + PulseMCP + Smithery + mcp.so valent le coup pour la **découverte/propagation** (le registre officiel alimente Glama/PulseMCP), mais leur valeur de lien SEO directe est non confirmée (SPA/JS). Donc : **1 lien dofollow solide (Glama) + de la présence écosystème**, pas 5-7 liens SEO comme annoncé avant. Zéro risque update.
