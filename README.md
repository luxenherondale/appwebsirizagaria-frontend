# Editorial Siriza Agaria — Frontend

Este proyecto es la interfaz web para la gestión y control de stock, ventas, contabilidad y operaciones de la Editorial Siriza Agaria. Está desarrollado en React utilizando Vite para optimizar el flujo de trabajo y la velocidad de desarrollo.

## Enlaces de Despliegue

- **Frontend:** [https://appsirizagaria.mooo.com/](https://appsirizagaria.mooo.com/)
- **API Backend:** [https://api.appsirizagaria.mooo.com/](https://api.appsirizagaria.mooo.com/)

## Repositorios

- **Frontend:** Este repositorio
- **Backend:** [https://github.com/luxenherondale/appwebsirizagaria-backend](https://github.com/luxenherondale/appwebsirizagaria-backend)

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

- [React]
- [Vite]
- [React Router]
- [normalize.css]
- Arquitectura por componentes y CSS modular

---

## **Estructura de carpetas**

```
src/
│
├── assets/ # Recursos estáticos como imágenes, iconos, etc.
├── components/ # Componentes React reutilizables
│ ├── App/ # Componente principal de la aplicación
│ ├── Footer/ # Componente de pie de página
│ ├── Main/ # Layout principal de la aplicación
│ └── ...
│
├── config/ # Configuraciones de la aplicación
│ └── api.js # Configuración centralizada de la API
│
├── contexts/ # Contextos de React para estado global
│ └── AuthContext.jsx # Contexto de autenticación
│
├── images/ # Imágenes y assets gráficos
│
├── pages/ # Componentes de páginas completas
│ ├── Contabilidad/ # Módulo de contabilidad
│ ├── Index/ # Página de inicio de sesión
│ ├── Inicio/ # Dashboard principal
│ ├── NotFound/ # Página 404
│ ├── Register/ # Página de registro
│ └── Stock/ # Módulo de gestión de stock
│
├── services/ # Servicios para comunicación con la API
│ ├── bookService.js # Servicio para gestión de libros
│ └── userService.js # Servicio para gestión de usuarios
│
├── utils/ # Funciones utilitarias y helpers
│ ├── MainApi.js # Centralización de llamadas a la API
│ └── mockApi.js # API simulada para desarrollo
│
└── vendor/ # Recursos externos como fuentes y normalize.css
```

## **Instalación y Ejecución**

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/appwebsirizagaria-frontend.git
   cd appwebsirizagaria-frontend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

4. Compilar para producción:
   ```bash
   npm run build
   ```

## **Configuración**

La aplicación puede funcionar con una API real o con una API simulada para desarrollo:

- Para usar la API real: Asegúrate de que `USE_MOCK_API = false` en `src/utils/MainApi.js`
- Para desarrollo sin backend: Configura `USE_MOCK_API = true` para usar datos simulados

## **Despliegue**

La aplicación está desplegada en:
- Frontend: [https://appsirizagaria.mooo.com/](https://appsirizagaria.mooo.com/)
- API Backend: [https://api.appsirizagaria.mooo.com/](https://api.appsirizagaria.mooo.com/)

Para desplegar una nueva versión:

1. Asegúrate de que no haya `console.log` en el código de producción
2. Verifica que `USE_MOCK_API = false` para usar la API real
3. Ejecuta `npm run build`
4. Sube los archivos de la carpeta `dist` a tu servidor web

```
