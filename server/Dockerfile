FROM node:20-alpine

WORKDIR /app

# copy root package files (workspace config)
COPY package*.json ./
COPY package-lock.json ./

# copy workspace package files
COPY server/package*.json ./server/
COPY shared/package*.json ./shared/

# copy prisma schema
COPY server/prisma ./server/prisma/

# install all dependencies from root
RUN npm install --include=dev

# copy shared source code
COPY shared/ ./shared/

# copy server source code
COPY server/ ./server/

# generate prisma client
RUN npx prisma generate --schema=./server/prisma/schema.prisma

# set working directory to server
WORKDIR /app/server

CMD ["npm", "run", "dev"]