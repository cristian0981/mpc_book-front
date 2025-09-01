# Etapa de construcción
FROM node:22-alpine as build

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción con serve
FROM node:22-alpine

WORKDIR /app

# Instalar serve globalmente
RUN npm install -g serve

# Copiar archivos construidos
COPY --from=build /app/dist ./dist

# Exponer puerto
EXPOSE 3000

# Comando para servir la aplicación
CMD ["serve", "-s", "dist", "-l", "3000"]