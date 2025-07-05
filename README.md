# Editorial Siriza Agaria — Frontend

Este proyecto es la interfaz web para la gestión y control de stock, ventas, contabilidad y operaciones de la Editorial Siriza Agaria. Está desarrollado en React utilizando Vite para optimizar el flujo de trabajo y la velocidad de desarrollo.

---

## **Características**

- Visualización y gestión de stock de libros (segmentado por categorías y ubicaciones)
- Dashboard y reportes gráficos interactivos
- Módulos para contabilidad, gastos, ingresos y órdenes
- Módulo de proyectos editoriales en proceso
- Generación de cotizaciones y PDF
- Módulo de marketing y rastreo de campañas con influencers
- Catálogo de libros exportable a PDF
- Control de acceso por roles de usuario (admin, editor, lector)

---

## **Tecnologías**

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [normalize.css](https://necolas.github.io/normalize.css/)
- Arquitectura por componentes y CSS modular
- Estructura profesional para proyectos medianos y grandes

---

## **Estructura de carpetas**

```plaintext
src/
│
├── components/        # Componentes React (cada uno en su carpeta)
│     ├── App/
│     ├── Header/
│     ├── Main/
│     ├── Navigation/
│     ├── Footer/
│     ├── Preloader/
│     └── ...
│
├── images/            # Imágenes y assets gráficos
├── utils/             # Funciones utilitarias, helpers y lógica de API
├── vendor/            # Fuentes, normalize.css y recursos externos
│     ├── fonts/
│     └── normalize.css
│
└── index.css          # CSS global
```

--

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
.......

Usuarios predeterminados:
Admin: admin@sirizagaria.com / admin123
Editor: editor@sirizagaria.com / editor123
Lector: lector@sirizagaria.com / lector123