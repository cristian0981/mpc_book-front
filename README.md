
## 🚦 Instalación y Configuración

### Prerrequisitos
- Node.js 20.19+ o 22.12+
- npm o yarn
- Git

### Instalación Local

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/cristian0981/mpc_book-front.git
   cd app-cmpc-books
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Editar el archivo `.env` con las configuraciones necesarias:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_URL_IMG=http://localhost:5000/files/
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

5. **Construir para producción**
   ```bash
   npm run build
   ```

6. **Previsualizar build de producción**
   ```bash
   npm run preview
   ```

## 🐳 Despliegue con Docker

### Desarrollo Local con Docker

```bash
# Construir y ejecutar en modo desarrollo
docker-compose up --build -d

```




## 🔧 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza el build de producción
- `npm run lint` - Ejecuta el linter de código

## 🌐 Rutas de la Aplicación

### Rutas Protegidas (requieren autenticación)
- `/` - Redirige a `/books`
- `/books` - Lista de libros
- `/books/new` - Crear nuevo libro
- `/books/edit/:id` - Editar libro
- `/books/view/:id` - Ver detalles del libro
- `/authors` - Gestión de autores
- `/genres` - Gestión de géneros
- `/editorials` - Gestión de editoriales

### Rutas Públicas
- `/login` - Inicio de sesión
- `/register` - Registro de usuario

## 🔐 Autenticación

El sistema utiliza autenticación basada en cookies con JWT. Las rutas están protegidas mediante el componente `ProtectedRoute` que verifica el estado de autenticación del usuario.

## 🎨 Componentes UI

La aplicación utiliza una biblioteca de componentes personalizada basada en:
- **Radix UI** - Componentes base accesibles
- **Tailwind CSS** - Estilos utilitarios
- **Lucide React** - Iconografía
- **Class Variance Authority** - Variantes de componentes

## 📱 Responsive Design

La aplicación está completamente optimizada para dispositivos móviles y de escritorio, utilizando:
- Tailwind CSS para diseño responsive
- Hook personalizado `use-mobile` para detección de dispositivos
- Componentes adaptativos según el tamaño de pantalla

## 🔄 Gestión de Estado

- **Contexto de Autenticación**: Manejo del estado de usuario autenticado
- **React Hook Form**: Gestión de estado de formularios
- **Axios**: Manejo de peticiones HTTP con interceptores

## 🚨 Manejo de Errores

- Interceptores de Axios para manejo centralizado de errores
- Validación de formularios con Zod
- Notificaciones de error con Sonner
- Páginas de error personalizadas (404)

