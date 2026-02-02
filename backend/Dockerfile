FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --silent || npm install --silent
COPY . .
ENV NODE_ENV=production
EXPOSE 4000
CMD ["sh", "-c", "npm run migrate && node src/index.js"]
