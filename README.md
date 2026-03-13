# FEP2026 — Estéreo Picnic Festival Schedule Builder

Arma tu agenda personalizada para el Festival Estéreo Picnic 2026 (Marzo 20–22, Bogotá). Selecciona artistas, comparte con amigos y combina agendas para ir juntos.

## 🎵 Funciones

- **Grilla interactiva** — Vista de horarios por día con 6 escenarios
- **Agenda personal** — Selecciona artistas con un clic, ve conflictos de horario
- **Seed compartible** — Tu agenda se codifica en la URL para compartir fácilmente
- **Combinar agendas** — Pega los seeds de tus amigos para ver la ruta del grupo
- **Recomendaciones** — Sugerencias de artistas basadas en tus gustos
- **Búsqueda** — Encuentra artistas rápidamente
- **Responsive** — Funciona en desktop y móvil

## 🚀 Deploy en GitHub Pages

1. Sube este repositorio a GitHub
2. Ve a Settings → Pages → Source: Deploy from branch → `main` / `root`
3. Tu sitio estará en `https://tu-usuario.github.io/FEP2026/`

## 💻 Desarrollo local

```bash
npx serve .
```

Abre `http://localhost:3000` en tu navegador.

## 📂 Estructura

```
├── index.html          # SPA shell
├── css/style.css       # Diseño completo
├── js/
│   ├── data.js         # Datos del festival + géneros
│   ├── app.js          # Controlador principal
│   ├── schedule.js     # Renderizado de la grilla
│   ├── seed.js         # Codificación/decodificación de seeds
│   ├── merge.js        # Combinación de agendas
│   └── recommend.js    # Motor de recomendaciones
└── README.md
```

## 🔗 Compartir

Tu agenda se guarda automáticamente en la URL como `#s=XXXX`. Copia el link y compártelo con tus amigos.
