# Utilizamos la imagen oficial de Node.js
FROM node:18.16 as build-stage

# Crea un directorio para alojar la aplicación en el contenedor
WORKDIR /usr/src/app

# Copia el archivo de dependencias (package.json y package-lock.json) en el contenedor
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm ci

# Copia el resto del código de la aplicación en el contenedor
COPY . .

# Vuelve a compilar las dependencias nativas
RUN npm rebuild

# Crea la etapa de producción
FROM node:14 as production-stage

WORKDIR /usr/src/app

# Copia desde la etapa de construcción
COPY --from=build-stage /usr/src/app .

# Expone el puerto en el que se ejecutará tu aplicación
EXPOSE 3000

# Define el comando que se ejecutará cuando se inicie el contenedor
CMD [ "node", "server.js" ]
