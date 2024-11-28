FROM node:18

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 3000

RUN pnpm add concurrently

CMD ["pnpm", "concurrently", "\"node websocket-server.js\"", "\"pnpm start\""]
