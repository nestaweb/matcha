FROM node:18

WORKDIR /app

RUN npm install -g pnpm node-pre-gyp

COPY package.json pnpm-lock.yaml* ./

# Install dependencies with node-pre-gyp
RUN pnpm install --frozen-lockfile && \
    npm rebuild bcrypt --build-from-source

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "concurrently", "\"node websocket-server.js\"", "\"pnpm start\""]