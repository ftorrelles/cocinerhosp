# Proposal: fase-6-pwa

## Intent

Completar la configuración PWA para que CocinerHosp sea instalable en iOS y Android con experiencia completa offline, splash screen, y botón de instalación.

## Scope

### In Scope
- Meta tags PWA en index.html (iOS: apple-mobile-web-app-capable, apple-touch-icon, theme-color)
- Página offline personalizada (estática, diseñada con colores del theme)
- Hook `useInstallPWA` para `beforeinstallprompt`
- Componente `InstallPWA` con botón de instalación
- Configuración de `navigateFallback` en Workbox para offline navigation
- Eliminar `public/manifest.json` duplicado (el plugin lo genera)

### Out of Scope
- Service Worker custom (usamos generateSW del plugin)
- Push notifications
- Background sync

## Capabilities

### New Capabilities
- `pwa-install`: botón de instalación para add-to-home-screen
- `offline-page`: página offline con diseño de la app

## Approach

Meta tags en `index.html` para iOS. `public/offline.html` como página estática offline con el mismo diseño visual que la app. Hook `useInstallPWA` escucha `beforeinstallprompt` y expone estado + acción de instalación. Componente `InstallPWA` se renderiza en `ProtectedLayout` cuando el evento está disponible.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `index.html` | Modified | Meta tags iOS + PWA |
| `public/manifest.json` | Removed | Duplicado, lo genera el plugin |
| `public/offline.html` | New | Página offline estática con diseño de la app |
| `src/hooks/useInstallPWA.ts` | New | Hook beforeinstallprompt |
| `src/components/ui/InstallPWA.tsx` | New | Botón de instalación |
| `src/components/layout/ProtectedLayout.tsx` | Modified | Mostrar InstallPWA |
| `vite.config.ts` | Modified | navigateFallback en workbox |

## Risks

None. Son mejoras progresivas — si algo falla, la app sigue funcionando.

## Rollback Plan

Revert cambios en index.html, vite.config.ts, ProtectedLayout.tsx. Eliminar offline.html, useInstallPWA.ts, InstallPWA.tsx.

## Dependencies

- Navegador compatible con beforeinstallprompt (Chrome Android, Samsung Internet)

## Success Criteria

- [ ] App instalable desde Chrome Android con botón de instalación
- [ ] App instalable desde Safari iOS (compartir → Agregar a pantalla de inicio)
- [ ] Página offline se muestra cuando no hay conexión
- [ ] Build PWA exitoso
- [ ] Sin errores de TypeScript
