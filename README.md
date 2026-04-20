# 🔧 DevTools Pill

Píldora interactiva para aprender a usar las **herramientas de desarrollo del navegador** (DevTools), especialmente la pestaña **Network**, mediante retos prácticos.

## 🎯 Objetivo

Una SPA Angular que guía al usuario a través de 4 niveles donde debe usar las DevTools para resolver cada reto.

## 🚀 Ejecutar localmente

```bash
npm install
npm start
```

Abre http://localhost:4200

## 📦 Build de producción

```bash
npm run build
```

## 🌐 Desplegar en GitHub Pages

El despliegue es automático al hacer push a `main` usando GitHub Actions.

Configuración necesaria en GitHub:
- Ve a Settings → Pages.
- En Build and deployment, selecciona Source: GitHub Actions.
- No uses Deploy from a branch para este proyecto, porque terminaría sirviendo el contenido del repositorio (por ejemplo el README) en lugar del artefacto compilado.

Para hacerlo manualmente:
```bash
npm run build -- --base-href="/<nombre-del-repo>/"
```

Luego copia `dist/devtools-pill/browser/` a tu rama `gh-pages`.

## 📚 Niveles

### Nivel 1 - Bloquear Request
Aprende a bloquear requests desde DevTools. El tracker no debe completarse.
- DevTools → Network → clic derecho en `/api/level-1/tracker` → "Block request URL"

### Nivel 2 - Modificar JSON
El botón envía un body vacío. Usa "Edit and Resend" para enviar el body correcto y el nivel se completará cuando el mock acepte esa request reenviada.
- DevTools → Network → clic derecho en request → "Edit and Resend"

### Nivel 3 - Editar Body y Header
Necesitas modificar el body Y añadir un header específico (`Cache-Control: no-cache`). El nivel se completa cuando la request reenviada cumple ambas condiciones.
- DevTools → Network → "Edit and Resend" → modifica headers y body

### Nivel 4 - Throttling
Simula conexión lenta para poder pulsar "Continuar ahora" mientras carga.
- DevTools → Network → Throttling → "Slow 3G"

## 🏗️ Arquitectura

```
src/app/
├── core/
│   ├── models/       # Interfaces TypeScript
│   ├── services/     # Servicios (API, Progress, Storage)
│   └── guards/       # ProgressGuard
├── features/
│   ├── home/         # Pantalla principal
│   ├── level1-4/     # Un componente por nivel
│   └── final/        # Pantalla final y ranking
├── mock/
│   ├── browser.ts    # Setup de MSW
│   └── handlers.ts   # Manejadores de las APIs simuladas
└── shared/           # Componentes reutilizables
```
