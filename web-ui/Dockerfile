# Build Stage 1

FROM node:current-alpine AS build

ARG BACKEND_URL
ENV BACKEND_URL=$BACKEND_URL

WORKDIR /app

RUN corepack enable

# Copy package.json and your lockfile, here we add pnpm-lock.yaml for illustration
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy the entire project
COPY . ./

# Build the project
RUN npm run build

# Build Stage 2

FROM node:current-alpine
WORKDIR /app

# Only `.output` folder is needed from the build stage
COPY --from=build /app/.output/ ./

ENV NITRO_PORT=3014
ENV NITRO_HOST=0.0.0.0
ENV PORT=3014
ENV HOST=0.0.0.0
EXPOSE 3014

CMD ["node", "/app/server/index.mjs"]