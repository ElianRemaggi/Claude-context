# Claude Session Recovery

Recuperá y continuá tus conversaciones de Claude Code desde el navegador.

## ¿Qué hace?

- Lee tu carpeta `.claude/projects` usando la File System Access API (sin subir nada a ningún servidor)
- Parsea los archivos JSONL de sesiones de Claude Code
- Muestra tus proyectos y sesiones con previews
- Te permite buscar por texto dentro de las conversaciones
- Copia la conversación completa al portapapeles para pegarla en claude.ai o Claude Code

## Setup local

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en **Chrome, Edge o Brave** (la File System Access API no funciona en Firefox/Safari).

## Deploy en Vercel

### Opción 1: Desde GitHub (recomendado)
1. Subí este proyecto a un repositorio de GitHub
2. Andá a [vercel.com/new](https://vercel.com/new)
3. Importá el repo → Vercel lo detecta como Next.js automáticamente
4. Click en **Deploy**

### Opción 2: Desde CLI
```bash
npm i -g vercel
vercel
```

### Opción 3: Deploy manual del build estático
```bash
npm run build
# La carpeta `out/` contiene el sitio estático listo para subir a cualquier hosting
```

## Ruta de las conversaciones

La app espera que selecciones la carpeta de proyectos de Claude Code:

```
Windows: C:\Users\tu-usuario\.claude\projects
macOS:   ~/.claude/projects
Linux:   ~/.claude/projects
```

Cada subcarpeta es un proyecto con archivos `.jsonl` que contienen las sesiones.

## Privacidad

Todos los datos se procesan localmente en tu navegador. Ningún archivo sale de tu máquina. No hay backend, no hay base de datos, no hay analytics.

## Stack

- Next.js 14 (App Router, static export)
- TypeScript
- Tailwind CSS
- Zustand (state management)
- File System Access API
