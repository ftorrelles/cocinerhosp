# CocinerHosp 🏥

PWA mobile-first para gestión de producción de comedor hospitalario.

## Stack
- React 18 + TypeScript + Vite
- Tailwind CSS
- Supabase (Auth + DB)
- vite-plugin-pwa

## Archivos clave
- `PRD.md` — Lógica de negocio completa, fórmulas, estructura
- `AGENTS.md` — Reglas de código para agentes AI
- `PROMPT_INICIAL.md` — Prompts por fase para OpenCode/Claude Code
- `PROTOTYPE.html` — Prototipo funcional de referencia visual

## Inicio rápido

```bash
npm install
cp .env.example .env.local  # añadir VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
npm run dev
```

## Deploy (Vercel)
1. Conectar repo en vercel.com
2. Añadir variables de entorno de Supabase
3. Deploy automático en cada push a main

## Variables de entorno
```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```
