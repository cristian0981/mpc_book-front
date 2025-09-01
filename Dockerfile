# Etapa de construcción
FROM node:22-alpine as build

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar TODAS las dependencias (incluye devDependencies necesarias para compilar)
RUN npm ci --legacy-peer-deps

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción con serve
FROM node:22-alpine

WORKDIR /app

# Instalar serve globalmente
RUN npm install -g serve

# Copiar solo lo necesario desde la etapa de build
COPY --from=build /app/dist ./dist
COPY package*.json ./

# Exponer puerto
EXPOSE 3000

# Comando para servir la aplicación
CMD ["serve", "-s", "dist", "-l", "3000"]
