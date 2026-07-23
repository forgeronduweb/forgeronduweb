FROM node:22-alpine

WORKDIR /app

COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm ci --omit=dev

COPY backend ./backend
COPY frontend ./frontend
COPY admin ./admin

WORKDIR /app/backend
ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "server.js"]
