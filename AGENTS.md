# Sabores & Experiencias — Documentación Técnica

> **Proyecto:** Sitio web editorial de crónicas y experiencias nicaragüenses
> **Marca:** Sabores & Experiencias — "Crónicas de lugares y momentos"
> **Stack:** Astro 7 · Tailwind CSS 4 · TypeScript strict · Lucide icons
> **Diseño:** Editorial Heritage (ver `html_design/DESIGN.md`)

---

## Índice

1. [Resumen del Proyecto](#1-resumen-del-proyecto)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Estructura del Proyecto](#3-estructura-del-proyecto)
4. [Patrón de Componentes](#4-patrón-de-componentes)
5. [Layouts: Público vs Backoffice](#5-layouts-público-vs-backoffice)
6. [Estilos y Design Tokens](#6-estilos-y-design-tokens)
7. [Origen de Datos (Fases)](#7-origen-de-datos-fases)
8. [Backoffice Futuro (Vue 3 + Vunotek Theme)](#8-backoffice-futuro-vue-3--vunotek-theme)
9. [API Pattern SOA (Futuro)](#9-api-pattern-soa-futuro)
10. [Convenciones de Código](#10-convenciones-de-código)
11. [Comandos y Verificación](#11-comandos-y-verificación)

---

## 1. Resumen del Proyecto

Sabores & Experiencias es una guía editorial basada en experiencias reales, visitas anónimas y observación directa. El sitio presenta crónicas de lugares y momentos de Nicaragua con un enfoque editorial slow-media.

### Stack Técnico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Astro | 7.x |
| Estilos | Tailwind CSS | 4.x con `@theme` |
| Iconos | lucide (Astro público) | 1.x |
| Fuentes | Source Serif 4 + Work Sans | Google Fonts |
| Diseño | `html_design/DESIGN.md` | Design tokens |
| Datos actuales | JSON estático | `src/data/experiencias.json` |

---

## 2. Arquitectura del Sistema

```
┌──────────────────────────────────────────────────────┐
│                    Cliente (Browser)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────────┐   │
│  │  Home    │ │ Experien │ │   Sobre Nosotros      │   │
│  │          │ │ cias     │ │   + Detalle [slug]    │   │
│  └──────────┘ └──────────┘ └──────────────────────┘   │
│              │ fetch() /api/* (futuro)                │
└────────────────────────────────────────────────────────┘
                        │
┌───────────────────────▼────────────────────────────────┐
│              Astro (Static Generation)                  │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌────────────────────────┐ │
│  │ Layouts  │ │ Componen │ │ Pages (rutas .astro)   │ │
│  │ BaseLayo │ │ ts       │ │ index, experiencias,   │ │
│  │ ut       │ │ atoms/   │ │ experiencia/[slug],    │ │
│  │ AdminLay │ │ molecules│ │ sobre-nosotros         │ │
│  │ out (fut)│ │ /organis │ │                        │ │
│  └──────────┘ └──────────┘ └────────────────────────┘ │
│                        │                                │
│  ┌─────────────────────▼─────────────────────────────┐ │
│  │              Datos                                 │ │
│  │  Fase 1: JSON estático (src/data/experiencias.json)│ │
│  │  Fase 2: API PHP → JSON (fetch cliente)           │ │
│  │  Fase 3: MySQL + PHP SOA                          │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Estructura del Proyecto

```
/
├── html_design/                  # Diseños HTML originales + DESIGN.md
├── public/
│   ├── favicon.ico
│   └── favicon.svg
├── src/
│   ├── config/
│   │   └── site.ts              # Config de marca (nombre, SEO, redes)
│   ├── components/
│   │   ├── atoms/               # Componentes atómicos (Button, Icon, etc.)
│   │   ├── molecules/           # Combinación de atoms (CardExperiencia, etc.)
│   │   ├── organisms/           # Secciones completas (Navbar, HeroSection, etc.)
│   │   └── seo/                 # Componentes SEO (SEOMeta)
│   ├── data/
│   │   ├── experiencias.json    # Datos de semilla (6+ experiencias)
│   │   └── experiencias.ts      # Tipo TypeScript (interface Experiencia)
│   ├── layouts/
│   │   ├── BaseLayout.astro     # Layout público (SEO, fonts, scripts)
│   │   └── AdminLayout.astro    # (Futuro) Layout backoffice vunotek
│   ├── pages/
│   │   ├── index.astro          # Home
│   │   ├── experiencias.astro   # Listado experiencias
│   │   ├── experiencia/
│   │   │   └── [slug].astro     # Detalle dinámico (getStaticPaths)
│   │   └── sobre-nosotros.astro # Página institucional
│   ├── styles/
│   │   ├── base.css             # Tailwind @theme + design tokens
│   │   ├── public.css           # Clases utilitarias públicas
│   │   └── global.css           # Re-export base.css + public.css
│   └── env.d.ts
├── astro.config.mjs             # Config Astro (sitemap, tailwind)
├── tsconfig.json                # TypeScript strict
├── package.json                 # Dependencias Node.js
└── AGENTS.md                    # Este archivo
```

---

## 4. Patrón de Componentes

Se utiliza **Atomic Design** para organizar componentes:

### Atoms (Componentes más pequeños)

| Componente | Propósito |
|-----------|-----------|
| `Button.astro` | Botones primario/ghost con variantes |
| `EditorialDivider.astro` | Línea divisoria ochre con diamante ◆ |
| `LabelTag.astro` | Etiqueta all-caps con tracking |
| `AnimatedReveal.astro` | Wrapper IntersectionObserver para scroll reveal |
| `ReadingTime.astro` | Badge "X min de lectura" con icono |

### Molecules (Combinación de atoms)

| Componente | Propósito |
|-----------|-----------|
| `CardExperiencia.astro` | Card imagen 4:5 + label + título + excerpt + reading time |
| `CategoryFilter.astro` | Filtro icono + label con active state |
| `MethodCard.astro` | Card con hover effect (icono + título + descripción) |
| `NewsletterForm.astro` | Input email + botón, variantes light/dark |

### Organisms (Secciones completas)

| Componente | Página | Propósito |
|-----------|--------|-----------|
| `Navbar.astro` | Global | Sticky nav con links, active state, mobile menu |
| `Footer.astro` | Global | Grid 4-column con navegación, newsletter, redes |
| `HeroSection.astro` | Home | Hero fullscreen con overlay + CTAs |
| `IntroFeatureSection.astro` | Home | Texto + imagen + 3 columnas features |
| `CategoriesSection.astro` | Home | Grid categorías con iconos |
| `ChroniclesSection.astro` | Home | Grid 4 cards crónicas recientes |
| `BentoQuoteSection.astro` | Home | Layout bento quote + imágenes |
| `MethodSection.astro` | Home | 5-column método |
| `PageHero.astro` | Varias | Hero reutilizable (con/sin imagen) |
| `CategoryFiltersSection.astro` | Experiencias | Grid filtros + divider |
| `ExperiencesGrid.astro` | Experiencias | Grid cards + botón "Ver más" |
| `MethodologyTeaserSection.astro` | Experiencias | Sección asimétrica de método |
| `MissionSection.astro` | Sobre Nos | Texto de misión |
| `MethodCardsSection.astro` | Sobre Nos | 4 cards método con hover navy |
| `ValuesMosaicSection.astro` | Sobre Nos | Bento grid 12-column |
| `MethodologyCTASection.astro` | Sobre Nos | CTA descargar manual |
| `ArticleHero.astro` | Detalle | Hero con overlay + metadata |
| `ArticleContent.astro` | Detalle | Contenido 2-column editorial |
| `BentoGallery.astro` | Detalle | Galería de imágenes bento grid |
| `ArticleMethodBox.astro` | Detalle | Box de método con 3 columnas |
| `NewsletterSection.astro` | Detalle | CTA newsletter |

---

## 5. Layouts: Público vs Backoffice

### Layout Público (Actual)

`src/layouts/BaseLayout.astro`
- Google Fonts (Source Serif 4 + Work Sans)
- SEO meta tags via `SEOMeta.astro`
- Diseño editorial: cream background, navy primary, ochre accents
- Sharp 0px border-radius

### Layout Backoffice (Futuro — Vunotek Theme)

`src/layouts/AdminLayout.astro`
- Sidebar fija (250px) con fondo dark vunotek
- Auth guard vía fetch a `/api/admin/verify.php`
- Tema oscuro: monolith-black, off-white, clay accents
- Iconos lucide-vue-next
- Responsive: sidebar colapsa a top nav en mobile

**Conveniencia**: Ambos layouts coexisten. `BaseLayout` se usa para rutas públicas y `AdminLayout` para rutas `/admin/*`. Comparten `base.css` con los tokens base; cada layout carga sus propios estilos adicionales.

---

## 6. Estilos y Design Tokens

### Diseño Editorial Heritage

Los tokens de diseño están definidos en `html_design/DESIGN.md` y migrados a Tailwind 4 en `src/styles/base.css` via `@theme`:

**Paleta:**
- Primary (Midnight Navy): `#000f21`
- Secondary (Ochre Gold): `#795921`
- Background (Vintage Cream): `#fbf9f8`
- Ver `--color-*` en `base.css` para todos los tokens

**Tipografía:**
- `--font-display-lg` / `--font-headline-md`: Source Serif 4 (serif)
- `--font-body-*` / `--font-label-caps`: Work Sans (sans-serif)

**Espaciado:**
- `--spacing-unit`: 8px (base)
- `--spacing-container-max`: 1280px
- `--spacing-gutter`: 24px
- `--spacing-stack-sm/md/lg`: 16/32/64px

**Formas:** Sharp 0px (border-radius DEFAULT: 0)

### Organización de CSS

```css
src/styles/base.css    → @import "tailwindcss" + @theme (tokens) + keyframes
src/styles/public.css  → Clases utilitarias (.reveal, .img-lift, scrollbar)
src/styles/global.css  → @import "./base.css" + @import "./public.css"
src/styles/admin.css   → (Futuro) Estilos del panel admin
```

---

## 7. Origen de Datos (Fases)

### Fase 1 — JSON Estático (Actual)

`src/data/experiencias.json` contiene 6+ experiencias con la estructura completa:
- `slug`, `title`, `category`, `excerpt`
- `image`, `heroImage`, `gallery[]`, `sidebarImage`
- `paragraphs[]`, `details[]`, `quote`, `readingTime`, `location`

Las páginas dinámicas usan `getStaticPaths()` para generar las rutas en build time.

### Fase 2 — API PHP → JSON (Futuro Próximo)

Migrar a endpoints PHP que retornen el mismo JSON. Reemplazar imports locales por `fetch()`:

```astro
---
// En vez de: import data from '../data/experiencias.json'
// Hacer: const response = await fetch(`${apiBase}/api/experiencias/list.php`)
//        const data = await response.json()
---
```

### Fase 3 — MySQL + PHP SOA (Futuro)

Base de datos MySQL con tabla `experiencias`, endpoints SOA con Controllers/Models/Services.

---

## 8. Backoffice Futuro (Vue 3 + Vunotek Theme)

### Stack Planeado

| Capa | Tecnología |
|------|-----------|
| Framework Admin | Vue 3 (SPA montado en Astro) |
| Iconos | lucide-vue-next |
| Estilos | Tailwind CSS 4 con tema vunotek |
| Autenticación | Sesiones PHP + fetch verify |
| Datos | APIs PHP (SOA) → MySQL |

### Estructura Propuesta

```
src/
├── plugins/
│   └── vue-entrypoint.ts        # createApp + mount
├── components/
│   └── admin/                   # Componentes Vue del panel
│       ├── Sidebar.vue          # Sidebar navegación vunotek
│       ├── Dashboard.vue        # Stats cards
│       ├── ProductTable.vue     # CRUD productos
│       └── LoginForm.vue        # Formulario login
├── pages/
│   └── admin/                   # Páginas Astro shell
│       ├── _layout.astro        # AdminLayout con auth guard
│       ├── login.astro          # Login page
│       ├── index.astro          # Dashboard
│       ├── experiencias.astro   # CRUD experiencias
│       └── ...
└── stores/                      # Pinia stores
    └── auth.ts                  # Auth store
```

### Tema Vunotek (Admin)

```css
/* Tokens del tema oscuro admin */
--color-monolith-black: #1A1A1A;
--color-off-white: #F5F3F0;
--color-clay-accent: #C18C7E;
--sidebar-bg: #0b1326;
--sidebar-width: 260px;
```

---

## 9. API Pattern SOA (Futuro)

Cuando se implemente el backend, seguir el patrón Service-Oriented Architecture:

```
backend/
├── api/                    # Entry points HTTP (≤15 líneas c/u)
│   ├── experiencias/
│   │   ├── list.php        # GET - lista paginada
│   │   ├── get.php         # GET - detalle por slug
│   │   ├── create.php      # POST - crear (admin)
│   │   ├── update.php      # PUT - actualizar (admin)
│   │   └── delete.php      # DELETE - eliminar (admin)
│   └── admin/
│       ├── login.php
│       └── verify.php
├── Controllers/            # Lógica de negocio
│   └── ExperienciaController.php
├── Models/                 # Solo SQL prepared statements
│   └── ExperienciaModel.php
├── Services/               # Wrappers servicios externos
│   ├── AuthService.php
│   └── ImageKitService.php
├── Traits/
│   └── ApiResponse.php     # jsonResponse(), jsonError()
└── Config/
    └── Database.php        # PDO singleton
```

Cada endpoint sigue la estructura:
```php
<?php
declare(strict_types=1);
require_once __DIR__ . '/../../bootstrap.php';
use App\Config\Database;
use App\Controllers\ExperienciaController;
use App\Models\ExperienciaModel;

setCorsHeaders();
$controller = new ExperienciaController(new ExperienciaModel(Database::getConnection()));
$controller->list();
```

---

## 10. Convenciones de Código

### Astro/TypeScript
- TypeScript strict (tsconfig.json hereda de `astro/tsconfigs/strict`)
- Imports absolutos desde `src/`
- Props tipadas con interfaz en cada componente
- `getStaticPaths()` para rutas dinámicas

### Componentes
- **Atomic Design**: atoms → molecules → organisms
- Sin librerías UI externas (Tailwind + vanilla JS)
- Iconos: `lucide` en Astro, `lucide-vue-next` en Vue
- Sin comentarios en código (el código se explica solo)
- Props desestructuradas desde `Astro.props`

### Estilos
- Tailwind 4 con `@theme` para tokens de diseño
- Clases utilitarias inline (sin CSS modules)
- Preferir variantes de color semanticas (`bg-primary`, `text-secondary`)
- Scroll reveal via `AnimatedReveal` wrapper + clase `.reveal`

### Naming
- Archivos: `PascalCase.astro` para componentes
- Directorios: `snake_case` plural
- Rutas: `kebab-case` para slugs y URLs
- Interfaces: `PascalCase` con sufijo descriptivo

---

## 11. Comandos y Verificación

### Desarrollo

```bash
# Iniciar servidor de desarrollo en background (recomendado)
astro dev --background

# Gestionar servidor background
astro dev stop     # Detener
astro dev status   # Ver estado
astro dev logs     # Ver logs

# Alternativa: servidor en foreground
pnpm dev
```

### Build y Verificación

```bash
# Verificar TypeScript y configuración
pnpm astro check

# Build de producción
pnpm build

# Preview del build
pnpm preview
```

### Commands

| Comando | Descripción |
|---------|-----------|
| `pnpm dev` | Inicia servidor desarrollo |
| `pnpm build` | Build producción → `dist/` |
| `pnpm preview` | Preview del build |
| `pnpm astro check` | TypeScript check |
| `pnpm astro add` | Agregar integración |
| `pnpm astro sync` | Generar tipos TypeScript |

### Variables de Entorno

```env
# No requeridas actualmente (Fase 1 - JSON estático)
# FUTURO:
# API_BASE=http://localhost:8000    # Base URL para APIs PHP
```

### Referencias

- [Astro Docs](https://docs.astro.build)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [DESIGN.md](../html_design/DESIGN.md) — Sistema de diseño completo
