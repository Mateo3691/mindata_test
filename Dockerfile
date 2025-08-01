# Etapa 1: Build de Angular
FROM node:20-alpine AS build

WORKDIR /app

# Copiamos dependencias y las instalamos
COPY package*.json ./
RUN npm install

# Copiamos el resto de los archivos del proyecto
COPY . .

# Build de Angular en modo producción
RUN npm run build -- --configuration=production

# Etapa 2: Servidor nginx
FROM nginx:1.25-alpine

# Elimina configuración por defecto de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia la build al directorio del servidor
COPY --from=build /app/dist/mindata_test/browser /usr/share/nginx/html

# Copia archivo custom de configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
