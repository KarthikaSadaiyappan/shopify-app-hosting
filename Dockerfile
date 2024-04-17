FROM node:18-alpine
EXPOSE 7000
WORKDIR /app
COPY . .
COPY package.json package-lock.json ./
RUN npm ci
RUN npm install && npm run build
CMD ["npm", "run", "docker-start"]
